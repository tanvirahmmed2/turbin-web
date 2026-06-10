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
