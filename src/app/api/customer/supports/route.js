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

    if (customerRes.rows.length === 0) return NextResponse.json({ tickets: [] });

    const customerId = customerRes.rows[0].customer_id;

    const ticketsRes = await dbQuery(
      `SELECT ticket_id, subject, status, priority, created_at, updated_at 
       FROM tour_support_tickets 
       WHERE customer_id = $1
       ORDER BY updated_at DESC`,
      [customerId]
    );

    return NextResponse.json({ tickets: ticketsRes.rows });
  } catch (error) {
    console.error('Customer Supports Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
