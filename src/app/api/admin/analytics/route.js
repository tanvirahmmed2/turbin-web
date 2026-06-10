import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !['owner', 'manager'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tenantId = await getTenantId();

    // Fetch aggregate stats
    const statsResult = await dbQuery(`
      SELECT 
        (SELECT COUNT(*) FROM tour_customers WHERE tenant_id = $1) as total_customers,
        (SELECT COUNT(*) FROM tour_tours WHERE tenant_id = $1 AND status = 'active') as active_tours,
        (SELECT COUNT(*) FROM tour_bookings WHERE tenant_id = $1) as total_bookings,
        (SELECT COALESCE(SUM(amount), 0) FROM tour_payments p JOIN tour_bookings b ON p.booking_id = b.booking_id WHERE b.tenant_id = $1 AND p.status = 'success') as total_revenue
    `, [tenantId]);

    // Fetch recent bookings
    const recentBookingsResult = await dbQuery(`
      SELECT b.booking_id, c.name as customer_name, t.title as tour_title, b.status, b.total_price, b.created_at
      FROM tour_bookings b
      JOIN tour_customers c ON b.customer_id = c.customer_id
      JOIN tour_tours t ON b.tour_id = t.tour_id
      WHERE b.tenant_id = $1
      ORDER BY b.created_at DESC LIMIT 5
    `, [tenantId]);

    return NextResponse.json({ 
      stats: statsResult.rows[0],
      recentBookings: recentBookingsResult.rows 
    });
  } catch (error) {
    console.error('Fetch Analytics Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
