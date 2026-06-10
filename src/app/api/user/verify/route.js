import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing verification token' }, { status: 400 });
    }

    const tenantId = await getTenantId();

    // Find the user with this token
    const result = await dbQuery(
      `SELECT user_id, verification_token_expires 
       FROM tour_users 
       WHERE verification_token = $1 AND tenant_id = $2`,
      [token, tenantId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });
    }

    const user = result.rows[0];

    // Check expiration
    if (new Date() > new Date(user.verification_token_expires)) {
      return NextResponse.json({ error: 'Verification token has expired' }, { status: 400 });
    }

    // Update user to verified and clear tokens
    await dbQuery(
      `UPDATE tour_users 
       SET is_verified = TRUE, 
           verification_token = NULL, 
           verification_token_expires = NULL 
       WHERE user_id = $1`,
      [user.user_id]
    );

    return NextResponse.json({ success: true, message: 'Account verified successfully' });
  } catch (error) {
    console.error('Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
