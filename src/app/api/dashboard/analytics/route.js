import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const [metricsRes, topToursRes] = await Promise.all([
      query(`
        SELECT
          (SELECT COUNT(*) FROM tour_bookings WHERE tenant_id = $1) AS total_bookings,
          (SELECT COUNT(*) FROM tour_bookings WHERE tenant_id = $1 AND created_at > NOW() - INTERVAL '30 days') AS bookings_30d,
          (SELECT COALESCE(SUM(p.amount), 0) FROM tour_payments p JOIN tour_bookings b ON p.booking_id = b.booking_id WHERE b.tenant_id = $1 AND p.status = 'success') AS total_revenue,
          (SELECT COALESCE(SUM(p.amount), 0) FROM tour_payments p JOIN tour_bookings b ON p.booking_id = b.booking_id WHERE b.tenant_id = $1 AND p.status = 'success' AND p.paid_at > NOW() - INTERVAL '30 days') AS revenue_30d,
          (SELECT COUNT(*) FROM tour_tours WHERE tenant_id = $1) AS total_tours,
          (SELECT COUNT(*) FROM tour_customers WHERE tenant_id = $1) AS total_customers
      `, [session.tenant_id]),

      query(`
        SELECT tt.title,
               COUNT(b.booking_id)                                     AS booking_count,
               COALESCE(SUM(p.amount), 0)                              AS revenue
        FROM tour_tours tt
        LEFT JOIN tour_bookings b ON b.tour_id = tt.tour_id
        LEFT JOIN tour_payments p ON p.booking_id = b.booking_id AND p.status = 'success'
        WHERE tt.tenant_id = $1
        GROUP BY tt.tour_id, tt.title
        ORDER BY booking_count DESC
        LIMIT 5
      `, [session.tenant_id]),
    ]);

    return NextResponse.json({
      metrics: metricsRes.rows[0],
      topTours: topToursRes.rows,
    });
  } catch (err) {
    return errorResponse(err, 'GET /api/dashboard/analytics');
  }
}
