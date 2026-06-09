import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session || session.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, tenant_id } = session;

    const customerRes = await dbQuery(
      'SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    if (customerRes.rows.length === 0) return NextResponse.json({ bookings: [] });

    const customerId = customerRes.rows[0].customer_id;

    const bookingsRes = await dbQuery(
      `SELECT b.booking_id, b.status, b.seats, b.total_price, b.created_at, t.title, s.tour_date 
       FROM tour_bookings b
       JOIN tour_tours t ON b.tour_id = t.tour_id
       JOIN tour_schedules s ON b.schedule_id = s.schedule_id
       WHERE b.customer_id = $1
       ORDER BY b.created_at DESC`,
      [customerId]
    );

    return NextResponse.json({ bookings: bookingsRes.rows });
  } catch (error) {
    console.error('Customer Bookings Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
