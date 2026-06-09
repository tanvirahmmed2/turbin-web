import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { dbQuery } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const result = await dbQuery(
      'SELECT user_id, tenant_id, name, email, role, created_at FROM tour_users WHERE user_id = $1',
      [decoded.user_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Fetch User Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
