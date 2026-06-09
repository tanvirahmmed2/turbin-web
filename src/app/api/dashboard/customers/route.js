import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const res = await query(`
      SELECT c.customer_id, c.name, c.email, c.phone, c.created_at,
             COUNT(b.booking_id) AS booking_count
      FROM tour_customers c
      LEFT JOIN tour_bookings b ON b.customer_id = c.customer_id
      WHERE c.tenant_id = $1
      GROUP BY c.customer_id, c.name, c.email, c.phone, c.created_at
      ORDER BY c.created_at DESC
    `, [session.tenant_id]);

    return NextResponse.json({ customers: res.rows });
  } catch (err) {
    return errorResponse(err, 'GET /api/dashboard/customers');
  }
}
