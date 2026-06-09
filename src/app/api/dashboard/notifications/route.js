import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

// GET /api/dashboard/notifications — list notifications for the tenant user
export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const res = await query(`
      SELECT n.notification_id, n.title, n.message, n.is_read, n.created_at
      FROM tour_notifications n
      WHERE n.tenant_id = $1 AND n.user_id = $2
      ORDER BY n.created_at DESC
      LIMIT 50
    `, [session.tenant_id, session.user_id]);

    const unread = res.rows.filter(n => !n.is_read).length;
    return NextResponse.json({ notifications: res.rows, unread });
  } catch (err) {
    return errorResponse(err, 'GET /api/dashboard/notifications');
  }
}

// PATCH /api/dashboard/notifications — mark one or all as read
export async function PATCH(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const { notification_id, mark_all } = await request.json();

    if (mark_all) {
      await query(
        `UPDATE tour_notifications SET is_read = TRUE WHERE tenant_id = $1 AND user_id = $2`,
        [session.tenant_id, session.user_id]
      );
    } else if (notification_id) {
      await query(
        `UPDATE tour_notifications SET is_read = TRUE WHERE notification_id = $1 AND user_id = $2`,
        [notification_id, session.user_id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err, 'PATCH /api/dashboard/notifications');
  }
}
