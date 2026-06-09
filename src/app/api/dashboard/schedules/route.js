import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const res = await query(`
      SELECT s.schedule_id, s.tour_date AS start_date, s.end_time AS end_date, s.available_seats,
             NULL AS price_override, 'active' AS status,
             t.title AS tour_title, t.base_price, t.tour_id
      FROM tour_schedules s
      JOIN tour_tours t ON t.tour_id = s.tour_id
      WHERE t.tenant_id = $1
      ORDER BY s.tour_date ASC
    `, [session.tenant_id]);

    return NextResponse.json({ schedules: res.rows });
  } catch (err) {
    return errorResponse(err, 'GET /api/dashboard/schedules');
  }
}
