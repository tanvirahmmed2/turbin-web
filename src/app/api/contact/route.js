import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function POST(req) {
  try {
    const tenantId = await getTenantId();
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await dbQuery(
      `INSERT INTO tour_contacts (tenant_id, name, email, phone, subject, message) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING contact_id`,
      [tenantId, name, email, phone, subject, message]
    );

    return NextResponse.json({ success: true, contact_id: result.rows[0].contact_id });
  } catch (error) {
    console.error('Contact Form Submission Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
