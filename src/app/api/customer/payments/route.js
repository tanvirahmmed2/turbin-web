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

    const customerRes = await dbQuery(
      'SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    if (customerRes.rows.length === 0) return NextResponse.json({ payments: [] });

    const customerId = customerRes.rows[0].customer_id;

    const paymentsRes = await dbQuery(
      `SELECT p.payment_id, p.amount, p.status, p.paid_at, p.provider, t.title as tour_title
       FROM tour_payments p
       JOIN tour_bookings b ON p.booking_id = b.booking_id
       JOIN tour_tours t ON b.tour_id = t.tour_id
       WHERE b.customer_id = $1
       ORDER BY p.paid_at DESC NULLS LAST`,
      [customerId]
    );

    return NextResponse.json({ payments: paymentsRes.rows });
  } catch (error) {
    console.error('Customer Payments Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
