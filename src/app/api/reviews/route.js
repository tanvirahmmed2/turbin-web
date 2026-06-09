import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET(req) {
  try {
    const tenantId = await getTenantId();

    const result = await dbQuery(
      `SELECT r.review_id, r.rating, r.comment, r.created_at, c.name as customer_name, t.title as tour_title 
       FROM tour_reviews r
       JOIN tour_customers c ON r.customer_id = c.customer_id
       JOIN tour_tours t ON r.tour_id = t.tour_id
       WHERE t.tenant_id = $1 AND r.is_approved = TRUE
       ORDER BY r.created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ reviews: result.rows });
  } catch (error) {
    console.error('Fetch Reviews Error:', error);
    return NextResponse.json({ reviews: [] }); // Fallback for no DB
  }
}
