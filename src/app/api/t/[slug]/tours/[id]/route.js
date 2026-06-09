import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug, id } = await params;
    
    const res = await query(`
      SELECT t.tour_id, t.title, t.description, t.location, t.base_price,
             tn.tenant_id, tn.name AS tenant_name
      FROM tour_tours t
      JOIN ts_tenants tn ON t.tenant_id = tn.tenant_id
      LEFT JOIN ts_domains d ON d.tenant_id = tn.tenant_id
      WHERE (d.domain = $1 OR tn.slug = $1) AND t.tour_id = $2 AND t.status = 'active'
      LIMIT 1
    `, [slug, id]);
    
    if (res.rows.length === 0) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    const tour = res.rows[0];

    const schedRes = await query(`
      SELECT schedule_id, tour_date, start_time, end_time, available_seats, max_seats, last_registration_date
      FROM tour_schedules
      WHERE tour_id = $1 AND tour_date >= CURRENT_DATE
      ORDER BY tour_date ASC
    `, [tour.tour_id]);

    return NextResponse.json({ tour, schedules: schedRes.rows });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
