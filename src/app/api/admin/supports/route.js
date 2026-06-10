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
    if (!decoded || !['owner', 'manager', 'support'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tenantId = await getTenantId();

    const result = await dbQuery(
      `SELECT ticket_id, customer_name, customer_email, subject, message, priority, status, created_at, updated_at
       FROM tour_support_tickets
       WHERE tenant_id = $1 
       ORDER BY created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ tickets: result.rows });
  } catch (error) {
    console.error('Fetch Support Tickets Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !['owner', 'manager', 'support'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { ticket_id, status } = await req.json();

    if (!ticket_id || !status) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const tenantId = await getTenantId();

    const check = await dbQuery(
      `SELECT ticket_id FROM tour_support_tickets WHERE ticket_id = $1 AND tenant_id = $2`,
      [ticket_id, tenantId]
    );

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found or forbidden' }, { status: 403 });
    }

    await dbQuery(
      `UPDATE tour_support_tickets SET status = $1, updated_at = NOW() WHERE ticket_id = $2`,
      [status, ticket_id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Support Ticket Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
