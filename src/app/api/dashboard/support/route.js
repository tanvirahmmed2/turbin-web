import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET /api/dashboard/support
// ?tab=customer  — customer tickets for this tenant
// ?tab=saas      — this tenant's own SaaS tickets
// ?ticketId=X    — full thread for either type (requires &type=customer|saas)
export async function GET(request) {
  try {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'customer';
    const ticketId = searchParams.get('ticketId');
    const type = searchParams.get('type') || tab;
    const tenantId = session.tenant_id;

    if (ticketId) {
      if (type === 'saas') {
        const t = await query(
          `SELECT * FROM ts_support_tickets WHERE ticket_id = $1 AND tenant_id = $2`,
          [ticketId, tenantId]
        );
        if (!t.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const r = await query(
          `SELECT r.*, u.name AS user_name
           FROM ts_support_replies r
           LEFT JOIN ts_users u ON u.user_id = r.user_id
           WHERE r.ticket_id = $1 ORDER BY r.created_at ASC`,
          [ticketId]
        );
        return NextResponse.json({ ticket: t.rows[0], replies: r.rows });
      } else {
        const t = await query(
          `SELECT * FROM tour_support_tickets WHERE ticket_id = $1 AND tenant_id = $2`,
          [ticketId, tenantId]
        );
        if (!t.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        const r = await query(
          `SELECT r.*, u.name AS staff_name
           FROM tour_support_replies r
           LEFT JOIN tour_users u ON u.user_id = r.staff_id
           WHERE r.ticket_id = $1 ORDER BY r.created_at ASC`,
          [ticketId]
        );
        return NextResponse.json({ ticket: t.rows[0], replies: r.rows });
      }
    }

    if (tab === 'saas') {
      const result = await query(
        `SELECT *,
          (SELECT COUNT(*) FROM ts_support_replies r WHERE r.ticket_id = t.ticket_id) AS reply_count
         FROM ts_support_tickets t
         WHERE t.tenant_id = $1
         ORDER BY t.updated_at DESC`,
        [tenantId]
      );
      return NextResponse.json({ tickets: result.rows });
    }

    // customer tickets
    const result = await query(
      `SELECT *,
        (SELECT COUNT(*) FROM tour_support_replies r WHERE r.ticket_id = t.ticket_id) AS reply_count
       FROM tour_support_tickets t
       WHERE t.tenant_id = $1
       ORDER BY t.updated_at DESC`,
      [tenantId]
    );
    return NextResponse.json({ tickets: result.rows });
  } catch (err) {
    console.error('[GET /api/dashboard/support]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/dashboard/support
// body: { type: 'saas'|'customer', ticket_id?, subject?, message, customer_name?, customer_email? }
export async function POST(request) {
  try {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { type, ticket_id, subject, message, customer_name, customer_email } = body;
    const tenantId = session.tenant_id;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (type === 'saas') {
      if (ticket_id) {
        // Reply on existing SaaS ticket
        await query(
          `INSERT INTO ts_support_replies (ticket_id, user_id, is_admin, message) VALUES ($1, $2, FALSE, $3)`,
          [ticket_id, session.user_id, message.trim()]
        );
        await query(
          `UPDATE ts_support_tickets SET updated_at = now() WHERE ticket_id = $1`,
          [ticket_id]
        );
      } else {
        // Create new SaaS ticket
        if (!subject?.trim()) return NextResponse.json({ error: 'Subject required' }, { status: 400 });
        await query(
          `INSERT INTO ts_support_tickets (tenant_id, subject, message) VALUES ($1, $2, $3)`,
          [tenantId, subject.trim(), message.trim()]
        );
      }
    } else {
      // Staff replying to a customer ticket
      if (!ticket_id) return NextResponse.json({ error: 'ticket_id required for customer reply' }, { status: 400 });
      await query(
        `INSERT INTO tour_support_replies (ticket_id, staff_id, is_staff, message) VALUES ($1, $2, TRUE, $3)`,
        [ticket_id, session.user_id, message.trim()]
      );
      await query(
        `UPDATE tour_support_tickets SET status = 'in_progress', updated_at = now() WHERE ticket_id = $1`,
        [ticket_id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/dashboard/support]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/dashboard/support — update customer ticket status
export async function PATCH(request) {
  try {
    const session = await getSession(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { ticket_id, status, type } = await request.json();
    const valid = ['open', 'in_progress', 'resolved', 'closed'];
    if (!ticket_id || !valid.includes(status)) {
      return NextResponse.json({ error: 'Valid ticket_id and status required' }, { status: 400 });
    }

    const table = type === 'saas' ? 'ts_support_tickets' : 'tour_support_tickets';
    await query(
      `UPDATE ${table} SET status = $1, updated_at = now() WHERE ticket_id = $2 AND tenant_id = $3`,
      [status, ticket_id, session.tenant_id]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/dashboard/support]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
