import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { sendEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const tenantId = await getTenantId();

    const result = await dbQuery(
      'SELECT user_id, name FROM tour_users WHERE email = $1 AND tenant_id = $2',
      [email, tenantId]
    );

    if (result.rows.length === 0) {
      // Return success anyway to prevent email enumeration
      return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
    }

    const user = result.rows[0];

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await dbQuery(
      `UPDATE tour_users 
       SET reset_password_token = $1, 
           reset_password_expires = $2 
       WHERE user_id = $3`,
      [resetToken, resetExpires, user.user_id]
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const emailHtml = `
      <h2>Reset your password</h2>
      <p>Hi ${user.name},</p>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#3b82f6;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      htmlContent: emailHtml
    });

    return NextResponse.json({ success: true, message: 'If an account exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
