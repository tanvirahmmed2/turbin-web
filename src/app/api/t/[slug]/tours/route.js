import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const res = await query(`
      SELECT t.tour_id AS id, t.title, t.description, t.base_price AS price 
      FROM tour_tours t
      JOIN ts_tenants tn ON t.tenant_id = tn.tenant_id
      LEFT JOIN ts_domains d ON d.tenant_id = tn.tenant_id
      WHERE (d.domain = $1 OR tn.slug = $1) AND t.status = 'active'
      ORDER BY t.created_at DESC LIMIT 6
    `, [slug]);
    
    return NextResponse.json(res.rows);
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
