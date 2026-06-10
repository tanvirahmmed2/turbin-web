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

    const result = await dbQuery(
      `SELECT 
        p.payment_id, p.amount, p.provider, p.transaction_id, p.status as payment_status, p.paid_at,
        b.booking_id,
        c.name as customer_name, c.email as customer_email,
        t.title as tour_title
       FROM tour_payments p
       JOIN tour_bookings b ON p.booking_id = b.booking_id
       JOIN tour_customers c ON b.customer_id = c.customer_id
       JOIN tour_tours t ON b.tour_id = t.tour_id
       WHERE b.tenant_id = $1 
       ORDER BY p.paid_at DESC NULLS LAST`,
      [tenantId]
    );

    return NextResponse.json({ payments: result.rows });
  } catch (error) {
    console.error('Fetch Payments Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
