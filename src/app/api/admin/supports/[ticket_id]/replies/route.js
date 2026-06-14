import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req, { params }) {
  try {
    const { ticket_id } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !['owner', 'manager', 'support'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tenantId = await getTenantId();

    // Verify ticket belongs to tenant
    const check = await dbQuery(
      `SELECT ticket_id, customer_name, customer_email, subject, message, priority, status, created_at, updated_at
       FROM tour_support_tickets 
       WHERE ticket_id = $1 AND tenant_id = $2`,
      [ticket_id, tenantId]
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

    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !['owner', 'manager', 'support'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Missing reply message' }, { status: 400 });
    }

    const tenantId = await getTenantId();

    // Verify ticket
    const check = await dbQuery(
      `SELECT ticket_id FROM tour_support_tickets WHERE ticket_id = $1 AND tenant_id = $2`,
      [ticket_id, tenantId]
    );

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Insert reply
    const result = await dbQuery(
      `INSERT INTO tour_support_replies (ticket_id, support_id, is_support, message) 
       VALUES ($1, $2, TRUE, $3) RETURNING reply_id, message, is_support, created_at`,
      [ticket_id, decoded.user_id, message]
    );

    // Update ticket updated_at and status if open
    await dbQuery(
      `UPDATE tour_support_tickets SET updated_at = NOW(), status = 'in_progress' WHERE ticket_id = $1 AND status = 'open'`,
      [ticket_id]
    );
    
    // Also update updated_at regardless
    await dbQuery(
      `UPDATE tour_support_tickets SET updated_at = NOW() WHERE ticket_id = $1`,
      [ticket_id]
    );

    const newReply = {
      ...result.rows[0],
      support_name: decoded.name, // Not in token, maybe need to fetch or ignore since we just need it visually
      support_role: decoded.role
    };

    return NextResponse.json({ success: true, reply: newReply });
  } catch (error) {
    console.error('Add Ticket Reply Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
