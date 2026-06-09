import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const res = await query(`
      SELECT user_id, name, email, role, created_at
      FROM tour_users
      WHERE tenant_id = $1 AND role != 'customer'
      ORDER BY created_at DESC
    `, [session.tenant_id]);

    return NextResponse.json({ staff: res.rows });
  } catch (err) {
    return errorResponse(err, 'GET /api/dashboard/staff');
  }
}
