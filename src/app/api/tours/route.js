import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET(req) {
  try {
    const tenantId = await getTenantId();

    const result = await dbQuery(
      `SELECT 
        tour_id, title, slug, description, location, base_price, status, created_at 
       FROM tour_tours 
       WHERE tenant_id = $1 AND status = 'active'
       ORDER BY created_at DESC
       LIMIT 6`,
      [tenantId]
    );

    return NextResponse.json({ tours: result.rows });
  } catch (error) {
    console.error('Fetch Tours Error:', error);
    // Return empty tours array if the database connection fails
    return NextResponse.json({ tours: [] });
  }
}
