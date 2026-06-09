import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const [statsRes, listRes] = await Promise.all([
      query(`
        SELECT
          COALESCE(SUM(CASE WHEN p.status = 'success' THEN p.amount ELSE 0 END), 0)                            AS total_revenue,
          COALESCE(SUM(CASE WHEN p.status = 'success'
                             AND p.paid_at > NOW() - INTERVAL '30 days'
                        THEN p.amount ELSE 0 END), 0)                                                      AS revenue_30d,
          COUNT(CASE WHEN p.status = 'pending' THEN 1 END)                                                 AS pending_count,
          COUNT(*)                                                                                        AS total_count
        FROM tour_payments p
        JOIN tour_bookings b ON b.booking_id = p.booking_id
        WHERE b.tenant_id = $1
      `, [session.tenant_id]),

      query(`
        SELECT p.payment_id, p.amount, p.status, p.provider AS payment_method, p.paid_at AS created_at,
               b.booking_id AS booking_reference,
               c.name AS customer_name
        FROM tour_payments p
        JOIN tour_bookings b       ON b.booking_id = p.booking_id
        LEFT JOIN tour_customers c ON c.customer_id = b.customer_id
        WHERE b.tenant_id = $1
        ORDER BY p.paid_at DESC NULLS LAST LIMIT 100
      `, [session.tenant_id]),
    ]);

    return NextResponse.json({
      stats: statsRes.rows[0],
      payments: listRes.rows,
    });
  } catch (err) {
    return errorResponse(err, 'GET /api/dashboard/payments');
  }
}
