import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { sendEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !['owner', 'manager', 'support'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { contact_id, message } = await req.json();

    if (!contact_id || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tenantId = await getTenantId();

    // Fetch contact details
    const contactResult = await dbQuery(
      `SELECT name, email, subject FROM tour_contacts WHERE contact_id = $1 AND tenant_id = $2`,
      [contact_id, tenantId]
    );

    if (contactResult.rows.length === 0) {
      return NextResponse.json({ error: 'Contact not found or forbidden' }, { status: 403 });
    }

    const contact = contactResult.rows[0];

    // Send Email
    const emailHtml = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>Re: ${contact.subject}</h2>
        <p>Hi ${contact.name},</p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Best regards,<br>Tourera Support Team</p>
      </div>
    `;

    await sendEmail({
      to: contact.email,
      subject: `Re: ${contact.subject}`,
      htmlContent: emailHtml,
    });

    // Update status to replied
    await dbQuery(
      `UPDATE tour_contacts SET status = 'replied' WHERE contact_id = $1`,
      [contact_id]
    );

    return NextResponse.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Contact Reply Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
