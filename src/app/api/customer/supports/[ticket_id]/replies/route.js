import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { ticket_id } = await params;
    
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, tenant_id } = session;

    const customerRes = await dbQuery(
      'SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    if (customerRes.rows.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customerId = customerRes.rows[0].customer_id;

    // Verify ticket belongs to this customer
    const check = await dbQuery(
      `SELECT ticket_id, subject, message, priority, status, created_at, updated_at
       FROM tour_support_tickets 
       WHERE ticket_id = $1 AND customer_id = $2`,
      [ticket_id, customerId]
    );

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const ticket = check.rows[0];

    // Fetch replies
    const repliesResult = await dbQuery(
      `SELECT r.reply_id, r.message, r.is_support, r.created_at, u.name as support_name, u.role as support_role
       FROM tour_support_replies r
       LEFT JOIN tour_users u ON r.support_id = u.user_id
       WHERE r.ticket_id = $1
       ORDER BY r.created_at ASC`,
      [ticket_id]
    );

    return NextResponse.json({ ticket, replies: repliesResult.rows });
  } catch (error) {
    console.error('Fetch Ticket Replies Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const { ticket_id } = await params;

    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, tenant_id } = session;
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Missing reply message' }, { status: 400 });
    }

    const customerRes = await dbQuery(
      'SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    if (customerRes.rows.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customerId = customerRes.rows[0].customer_id;

    // Verify ticket belongs to this customer
    const check = await dbQuery(
      `SELECT ticket_id, status FROM tour_support_tickets WHERE ticket_id = $1 AND customer_id = $2`,
      [ticket_id, customerId]
    );

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Insert reply
    const result = await dbQuery(
      `INSERT INTO tour_support_replies (ticket_id, support_id, is_support, message) 
       VALUES ($1, NULL, FALSE, $2) RETURNING reply_id, message, is_support, created_at`,
      [ticket_id, message]
    );

    // Update ticket updated_at and status if resolved/closed? Let's reopen if closed?
    // If ticket was resolved or closed, a new reply from customer probably should reopen it.
    let statusUpdateStr = `status = 'open'`; // Or keep it open
    if (check.rows[0].status === 'resolved' || check.rows[0].status === 'closed') {
       await dbQuery(
         `UPDATE tour_support_tickets SET updated_at = NOW(), status = 'open' WHERE ticket_id = $1`,
         [ticket_id]
       );
    } else {
       await dbQuery(
         `UPDATE tour_support_tickets SET updated_at = NOW() WHERE ticket_id = $1`,
         [ticket_id]
       );
    }

    const newReply = {
      ...result.rows[0],
      support_name: null,
      support_role: null
    };

    return NextResponse.json({ success: true, reply: newReply });
  } catch (error) {
    console.error('Add Ticket Reply Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
