import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';
import { verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { current_password, new_password } = await request.json();

    if (!current_password || !new_password) {
      return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 });
    }
    if (new_password.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    const table = session.tenant_id ? 'tour_users' : 'ts_users';
    const res = await query(`SELECT password FROM ${table} WHERE user_id = $1`, [session.user_id]);
    const user = res.rows[0];
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const valid = await verifyPassword(current_password, user.password);
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });

    const hashed = await hashPassword(new_password);
    await query(`UPDATE ${table} SET password = $1 WHERE user_id = $2`, [hashed, session.user_id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err, 'POST /api/auth/change-password');
  }
}
