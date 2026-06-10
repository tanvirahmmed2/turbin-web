import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    const tenantId = await getTenantId();

    const result = await dbQuery(
      `SELECT user_id, reset_password_expires 
       FROM tour_users 
       WHERE reset_password_token = $1 AND tenant_id = $2`,
      [token, tenantId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    const user = result.rows[0];

    if (new Date() > new Date(user.reset_password_expires)) {
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await dbQuery(
      `UPDATE tour_users 
       SET password = $1, 
           reset_password_token = NULL, 
           reset_password_expires = NULL 
       WHERE user_id = $2`,
      [hashedPassword, user.user_id]
    );

    return NextResponse.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
