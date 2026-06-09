import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const today = new Date().toISOString().split('T')[0];
    const [statsRes, recentBookingsRes, upcomingToursRes] = await Promise.all([
      query(`
        SELECT
          (SELECT COUNT(*) FROM tour_bookings WHERE tenant_id = $1 AND created_at >= CURRENT_DATE) AS bookings_today,
          (SELECT COUNT(*) FROM tour_tours   WHERE tenant_id = $1 AND status = 'active')        AS active_tours,
          (SELECT COUNT(*) FROM tour_customers WHERE tenant_id = $1)                            AS total_customers,
          (SELECT COALESCE(SUM(p.amount), 0)
           FROM tour_payments p JOIN tour_bookings b ON p.booking_id = b.booking_id 
           WHERE b.tenant_id = $1 AND p.status = 'success'
             AND p.paid_at >= CURRENT_DATE)                                                         AS revenue_today
      `, [session.tenant_id]),

      query(`
        SELECT b.booking_id, b.status, b.total_price, b.created_at,
               t.title AS tour_title,
               c.name AS customer_name
        FROM tour_bookings b
        JOIN tour_tours t   ON t.tour_id = b.tour_id
        LEFT JOIN tour_customers c ON c.customer_id = b.customer_id
        WHERE b.tenant_id = $1
        ORDER BY b.created_at DESC LIMIT 5
      `, [session.tenant_id]),

      query(`
        SELECT s.schedule_id, s.tour_date AS start_date, s.available_seats, t.title AS tour_title
        FROM tour_schedules s
        JOIN tour_tours t ON t.tour_id = s.tour_id
        WHERE t.tenant_id = $1 AND s.tour_date >= CURRENT_DATE
        ORDER BY s.tour_date ASC LIMIT 5
      `, [session.tenant_id]),
    ]);

    const row = statsRes.rows[0] || {};
    return NextResponse.json({
      stats: {
        bookingsToday:  parseInt(row.bookings_today || 0),
        revenueToday:   parseFloat(row.revenue_today || 0),
        activeTours:    parseInt(row.active_tours || 0),
        totalCustomers: parseInt(row.total_customers || 0),
      },
      recentBookings:  recentBookingsRes.rows,
      upcomingTours:   upcomingToursRes.rows,
    });
  } catch (err) {
    return errorResponse(err, 'GET /api/dashboard/overview');
  }
}
