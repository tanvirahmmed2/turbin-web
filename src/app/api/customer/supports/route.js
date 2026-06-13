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

export async function POST(req) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, tenant_id } = session;
    const body = await req.json();
    const { subject, message, priority = 'normal' } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: 'Missing subject or message' }, { status: 400 });
    }

    const customerRes = await dbQuery(
      'SELECT customer_id, name FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    if (customerRes.rows.length === 0) {
      return NextResponse.json({ error: 'Customer profile not found' }, { status: 404 });
    }

    const customer = customerRes.rows[0];

    const insertRes = await dbQuery(
      `INSERT INTO tour_support_tickets 
       (tenant_id, customer_id, customer_name, customer_email, subject, message, priority) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING ticket_id, subject, status, priority, created_at, updated_at`,
      [tenant_id, customer.customer_id, customer.name, email, subject, message, priority]
    );

    return NextResponse.json({ success: true, ticket: insertRes.rows[0] });
  } catch (error) {
    console.error('Create Support Ticket Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

