import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, tenant_id } = session;

    // Get customer_id
    const customerRes = await dbQuery(
      'SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    if (customerRes.rows.length === 0) {
      return NextResponse.json({
        stats: { total_bookings: 0, total_spent: 0 },
        upcoming_bookings: []
      });
    }

    const customerId = customerRes.rows[0].customer_id;

    // Get dashboard stats
    const bookingsCountRes = await dbQuery('SELECT COUNT(*) FROM tour_bookings WHERE customer_id = $1', [customerId]);
    const totalSpentRes = await dbQuery('SELECT SUM(total_price) FROM tour_bookings WHERE customer_id = $1 AND status != \'cancelled\'', [customerId]);

    // Get upcoming bookings
    const upcomingRes = await dbQuery(
      `SELECT b.booking_id, b.status, b.seats, b.total_price, t.title, s.tour_date 
       FROM tour_bookings b
       JOIN tour_tours t ON b.tour_id = t.tour_id
       JOIN tour_schedules s ON b.schedule_id = s.schedule_id
       WHERE b.customer_id = $1 AND s.tour_date >= CURRENT_DATE
       ORDER BY s.tour_date ASC LIMIT 5`,
      [customerId]
    );

    return NextResponse.json({
      stats: {
        total_bookings: parseInt(bookingsCountRes.rows[0].count, 10),
        total_spent: totalSpentRes.rows[0].sum || 0
      },
      upcoming_bookings: upcomingRes.rows
    });
  } catch (error) {
    console.error('Customer Dashboard Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
