import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

// GET /api/dashboard/customers/[customerId]
export async function GET(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  const { customerId } = await params;

  try {
    const [customerRes, bookingsRes, supportRes] = await Promise.all([
      query(`
        SELECT c.customer_id, c.name, c.email, c.phone, c.total_bookings, c.created_at
        FROM tour_customers c
        WHERE c.customer_id = $1 AND c.tenant_id = $2
      `, [customerId, session.tenant_id]),

      query(`
        SELECT b.booking_id, b.booking_id AS booking_reference, b.status, b.total_price,
               b.seats, b.created_at,
               t.title AS tour_title
        FROM tour_bookings b
        JOIN tour_tours t ON t.tour_id = b.tour_id
        WHERE b.customer_id = $1
        ORDER BY b.created_at DESC
        LIMIT 20
      `, [customerId]),

      query(`
        SELECT ticket_id, subject, status, created_at
        FROM tour_support_tickets
        WHERE customer_id = $1
        ORDER BY created_at DESC
        LIMIT 10
      `, [customerId]),
    ]);

    if (!customerRes.rows[0]) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({
      customer: customerRes.rows[0],
      bookings: bookingsRes.rows,
      support_tickets: supportRes.rows,
    });
  } catch (err) {
    return errorResponse(err, `GET /api/dashboard/customers/${customerId}`);
  }
}
