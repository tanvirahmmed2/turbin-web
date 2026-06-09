import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let queryStr;
    if (!session.tenant_id) {
      queryStr = `SELECT user_id, name, email, role, created_at FROM ts_users WHERE user_id = $1 LIMIT 1`;
    } else {
      queryStr = `
        SELECT u.user_id, u.name, u.email, u.role, u.tenant_id, u.created_at,
               t.name AS tenant_name, t.slug AS tenant_slug, t.status AS tenant_status
        FROM tour_users u
        JOIN ts_tenants t ON t.tenant_id = u.tenant_id
        WHERE u.user_id = $1 LIMIT 1
      `;
    }

    const result = await query(queryStr, [session.user_id]);
    const user = result.rows[0];
    
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('[GET /api/auth/me]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = getSessionFromRequest(request);
  if (!session) return unauthorizedResponse();

  try {
    const { name } = await request.json();
    if (!name?.trim()) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const table = session.tenant_id ? 'tour_users' : 'ts_users';
    await query(`UPDATE ${table} SET name = $1 WHERE user_id = $2`, [name.trim(), session.user_id]);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err, 'PATCH /api/auth/me');
  }
}
