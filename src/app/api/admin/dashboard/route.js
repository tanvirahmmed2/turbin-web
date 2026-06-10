import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { isManagement } from '@/lib/middleware';

export async function GET(req) {
  try {
    const { session, error } = await isManagement(req);
    if (error) return error;

    const tenantId = session.tenant_id;

    // Fetch Revenue (Total price from all non-cancelled bookings)
    const revenueRes = await dbQuery(
      `SELECT SUM(total_price) as total_revenue FROM tour_bookings WHERE tenant_id = $1 AND status != 'cancelled'`,
      [tenantId]
    );

    // Fetch Total Bookings Count
    const bookingsRes = await dbQuery(
      `SELECT COUNT(*) as total_bookings FROM tour_bookings WHERE tenant_id = $1`,
      [tenantId]
    );

    // Fetch Total Customers
    const customersRes = await dbQuery(
      `SELECT COUNT(*) as total_customers FROM tour_customers WHERE tenant_id = $1`,
      [tenantId]
    );

    // Fetch Active Tours
    const toursRes = await dbQuery(
      `SELECT COUNT(*) as active_tours FROM tour_tours WHERE tenant_id = $1 AND status = 'active'`,
      [tenantId]
    );

    // Fetch Recent Activity (Last 5 bookings)
    const recentActivityRes = await dbQuery(
      `SELECT b.booking_id, b.status, b.created_at, b.total_price, c.name as customer_name, t.title as tour_title
       FROM tour_bookings b
       JOIN tour_customers c ON b.customer_id = c.customer_id
       JOIN tour_tours t ON b.tour_id = t.tour_id
       WHERE b.tenant_id = $1
       ORDER BY b.created_at DESC LIMIT 5`,
      [tenantId]
    );

    return NextResponse.json({
      metrics: {
        revenue: revenueRes.rows[0].total_revenue || 0,
        bookings: parseInt(bookingsRes.rows[0].total_bookings, 10),
        customers: parseInt(customersRes.rows[0].total_customers, 10),
        active_tours: parseInt(toursRes.rows[0].active_tours, 10),
      },
      recentActivity: recentActivityRes.rows
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
