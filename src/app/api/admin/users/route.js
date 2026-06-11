import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !['owner', 'manager'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tenantId = await getTenantId();
    
    // Parse URL params
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    let query = 'SELECT user_id, name, email, role, is_verified, created_at FROM tour_users WHERE tenant_id = $1';
    
    if (type === 'team') {
      query += ` AND role IN ('owner', 'manager', 'staff', 'guide', 'support')`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await dbQuery(query, [tenantId]);

    return NextResponse.json({ users: result.rows });
  } catch (error) {
    console.error('Fetch Users Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    // Only owner can change roles
    if (!decoded || decoded.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tenantId = await getTenantId();
    const body = await req.json();
    const { user_id, new_role } = body;

    if (!user_id || !new_role) {
      return NextResponse.json({ error: 'Missing user_id or new_role' }, { status: 400 });
    }

    const allowedRoles = ['owner', 'manager', 'staff', 'guide', 'support', 'customer'];
    if (!allowedRoles.includes(new_role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    await dbQuery(
      'UPDATE tour_users SET role = $1 WHERE user_id = $2 AND tenant_id = $3',
      [new_role, user_id, tenantId]
    );

    return NextResponse.json({ message: 'Role updated successfully' });
  } catch (error) {
    console.error('Update Role Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
