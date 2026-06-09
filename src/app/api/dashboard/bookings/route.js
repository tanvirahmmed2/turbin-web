import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const today = new Date().toISOString().split('T')[0];
    const [statsRes, listRes] = await Promise.all([
      query(`
        SELECT
          COUNT(*)                                                              AS total,
          COUNT(CASE WHEN status = 'confirmed' THEN 1 END)                     AS confirmed,
          COUNT(CASE WHEN status = 'pending'   THEN 1 END)                     AS pending,
          COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END)               AS today
        FROM tour_bookings WHERE tenant_id = $1
      `, [session.tenant_id]),

      query(`
        SELECT b.booking_id, b.booking_id AS booking_reference, b.status, b.total_price, b.created_at,
               t.title AS tour_title,
               c.name AS customer_name,
               c.email  AS customer_email
        FROM tour_bookings b
        JOIN tour_tours t       ON t.tour_id = b.tour_id
        LEFT JOIN tour_customers c ON c.customer_id = b.customer_id
        WHERE b.tenant_id = $1
        ORDER BY b.created_at DESC
        LIMIT 100
      `, [session.tenant_id]),
    ]);

    return NextResponse.json({
      stats: statsRes.rows[0],
      bookings: listRes.rows,
    });
  } catch (err) {
    return errorResponse(err, 'GET /api/dashboard/bookings');
  }
}
