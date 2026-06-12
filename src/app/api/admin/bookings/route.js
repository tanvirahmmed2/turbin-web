import { NextResponse } from 'next/server';
import { dbQuery, withTransaction } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager', 'staff'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;

    const result = await dbQuery(
      `SELECT b.booking_id, b.seats, b.total_price, b.status, b.created_at, b.phone, b.transaction_id, b.separate_room, c.name as customer_name, c.email as customer_email, t.title as tour_title, s.tour_date
       FROM tour_bookings b
       JOIN tour_customers c ON b.customer_id = c.customer_id
       JOIN tour_tours t ON b.tour_id = t.tour_id
       JOIN tour_schedules s ON b.schedule_id = s.schedule_id
       WHERE b.tenant_id = $1
       ORDER BY b.created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ bookings: result.rows });
  } catch (error) {
    console.error('Admin Bookings Fetch Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager', 'staff'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { booking_id, status } = await req.json();
    const tenantId = session.tenant_id;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    return await withTransaction(async (client) => {
      // 1. Get current booking
      const bookingRes = await client.query(
        'SELECT status, seats, schedule_id FROM tour_bookings WHERE booking_id = $1 AND tenant_id = $2 FOR UPDATE',
        [booking_id, tenantId]
      );

      if (bookingRes.rows.length === 0) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      const booking = bookingRes.rows[0];

      if (booking.status === status) {
        return NextResponse.json({ success: true, message: 'Status unchanged' });
      }

      // 2. Logic for confirming
      if (status === 'confirmed' && booking.status !== 'confirmed') {
        // Check available seats
        const scheduleRes = await client.query(
          'SELECT available_seats FROM tour_schedules WHERE schedule_id = $1 FOR UPDATE',
          [booking.schedule_id]
        );
        const availableSeats = scheduleRes.rows[0]?.available_seats || 0;

        if (availableSeats < booking.seats) {
          throw new Error('Not enough seats available to confirm this booking');
        }

        // Deduct seats
        await client.query(
          'UPDATE tour_schedules SET available_seats = available_seats - $1 WHERE schedule_id = $2',
          [booking.seats, booking.schedule_id]
        );
      }

      // 3. Logic for cancelling a confirmed booking
      if (status === 'cancelled' && booking.status === 'confirmed') {
        // Return seats
        await client.query(
          'UPDATE tour_schedules SET available_seats = available_seats + $1 WHERE schedule_id = $2',
          [booking.seats, booking.schedule_id]
        );
      }

      // 4. Update status
      await client.query(
        'UPDATE tour_bookings SET status = $1 WHERE booking_id = $2',
        [status, booking_id]
      );

      return NextResponse.json({ success: true });
    });
  } catch (error) {
    console.error('Admin Bookings Update Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: error.message?.includes('Not enough seats') ? 400 : 500 });
  }
}
