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
      `SELECT contact_id, name, email, phone, subject, message, status, created_at
       FROM tour_contacts
       WHERE tenant_id = $1 
       ORDER BY created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ contacts: result.rows });
  } catch (error) {
    console.error('Fetch Contacts Error:', error);
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

    const { contact_id, status } = await req.json();

    if (!contact_id || !status) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

    const tenantId = await getTenantId();

    const check = await dbQuery(
      `SELECT contact_id FROM tour_contacts WHERE contact_id = $1 AND tenant_id = $2`,
      [contact_id, tenantId]
    );

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found or forbidden' }, { status: 403 });
    }

    await dbQuery(
      `UPDATE tour_contacts SET status = $1 WHERE contact_id = $2`,
      [status, contact_id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Contact Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
