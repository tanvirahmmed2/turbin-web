import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager', 'staff'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;

    const result = await dbQuery(
      `SELECT b.booking_id, b.seats, b.total_price, b.status, b.created_at, c.name as customer_name, c.email as customer_email, t.title as tour_title, s.tour_date
       FROM tour_bookings b
       JOIN tour_customers c ON b.customer_id = c.customer_id
       JOIN tour_tours t ON b.tour_id = t.tour_id
       JOIN tour_schedules s ON b.schedule_id = s.schedule_id
       WHERE b.tenant_id = $1
       ORDER BY b.created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ bookings: result.rows });
  } catch (error) {
    console.error('Admin Bookings Fetch Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
