import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

// GET /api/dashboard/bookings/[bookingId]
export async function GET(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  const { bookingId } = await params;

  try {
    const [bookingRes, paymentsRes] = await Promise.all([
      query(`
        SELECT
          b.booking_id, b.booking_id AS booking_reference, b.status, b.total_price,
          b.seats, b.created_at,
          t.title AS tour_title, t.location, t.tour_id,
          s.tour_date, s.start_time, s.end_time,
          c.customer_id, c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone
        FROM tour_bookings b
        JOIN tour_tours     t ON t.tour_id = b.tour_id
        LEFT JOIN tour_schedules  s ON s.schedule_id = b.schedule_id
        LEFT JOIN tour_customers  c ON c.customer_id = b.customer_id
        WHERE b.booking_id = $1 AND b.tenant_id = $2
      `, [bookingId, session.tenant_id]),

      query(`
        SELECT payment_id, amount, provider, transaction_id, status, paid_at
        FROM tour_payments
        WHERE booking_id = $1
        ORDER BY paid_at DESC
      `, [bookingId]),
    ]);

    if (!bookingRes.rows[0]) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      booking: bookingRes.rows[0],
      payments: paymentsRes.rows,
    });
  } catch (err) {
    return errorResponse(err, `GET /api/dashboard/bookings/${bookingId}`);
  }
}

// PATCH /api/dashboard/bookings/[bookingId] — update booking status
export async function PATCH(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  const { bookingId } = await params;
  const { status } = await request.json();
  const valid = ['pending', 'confirmed', 'cancelled'];

  if (!valid.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    await query(
      `UPDATE tour_bookings SET status = $1 WHERE booking_id = $2 AND tenant_id = $3`,
      [status, bookingId, session.tenant_id]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err, `PATCH /api/dashboard/bookings/${bookingId}`);
  }
}
