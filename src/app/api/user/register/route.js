import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { sendEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tenantId = await getTenantId();

    // Check if user exists in the tenant
    const existingUser = await dbQuery(
      'SELECT user_id FROM tour_users WHERE email = $1 AND tenant_id = $2',
      [email, tenantId]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Insert into tour_users
    const result = await dbQuery(
      `INSERT INTO tour_users (tenant_id, name, email, password, role, verification_token, verification_token_expires) 
       VALUES ($1, $2, $3, $4, 'customer', $5, $6) RETURNING user_id, name, email, role`,
      [tenantId, name, email, hashedPassword, verificationToken, verificationExpires]
    );

    const user = result.rows[0];

    // Ensure customer record exists
    await dbQuery(
      `INSERT INTO tour_customers (tenant_id, name, email) 
       VALUES ($1, $2, $3) 
       ON CONFLICT DO NOTHING RETURNING customer_id`,
      [tenantId, name, email]
    );

    // Send Verification Email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    const emailHtml = `
      <h2>Verify your email address</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="display:inline-block;padding:10px 20px;background:#3b82f6;color:white;text-decoration:none;border-radius:5px;">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Verify your account',
      htmlContent: emailHtml
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful! Please check your email to verify your account.' 
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
