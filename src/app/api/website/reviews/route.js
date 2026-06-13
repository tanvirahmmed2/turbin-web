import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET() {
  try {
    const tenantId = await getTenantId();

    const result = await dbQuery(
      `SELECT 
        r.review_id, r.rating, r.comment, r.created_at,
        c.name as customer_name
       FROM tour_reviews r
       JOIN tour_customers c ON r.customer_id = c.customer_id
       WHERE c.tenant_id = $1 AND r.is_approved = TRUE
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [tenantId]
    );

    return NextResponse.json({ reviews: result.rows });
  } catch (error) {
    console.error('Fetch Public Reviews Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
