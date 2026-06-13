import { NextResponse } from 'next/server';
import { dbQuery, withTransaction } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, tenant_id } = session;

    const customerRes = await dbQuery(
      'SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    if (customerRes.rows.length === 0) return NextResponse.json({ bookings: [] });

    const customerId = customerRes.rows[0].customer_id;

    const bookingsRes = await dbQuery(
      `SELECT b.booking_id, b.status, b.seats, b.total_price, b.created_at, t.title, s.tour_date 
       FROM tour_bookings b
       JOIN tour_tours t ON b.tour_id = t.tour_id
       JOIN tour_schedules s ON b.schedule_id = s.schedule_id
       WHERE b.customer_id = $1
       ORDER BY b.created_at DESC`,
      [customerId]
    );

    return NextResponse.json({ bookings: bookingsRes.rows });
  } catch (error) {
    console.error('Customer Bookings Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, tenant_id } = session;
    const body = await req.json();
    const { tour_id, schedule_id, seats, phone, transaction_id, separate_room, provider } = body;

    if (!tour_id || !schedule_id || !seats || !phone || !transaction_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Find or create customer
    let customerRes = await dbQuery(
      'SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    let customerId;
    if (customerRes.rows.length === 0) {
      const newCustomerRes = await dbQuery(
        'INSERT INTO tour_customers (tenant_id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING customer_id',
        [tenant_id, session.name || 'Customer', email, phone]
      );
      customerId = newCustomerRes.rows[0].customer_id;
    } else {
      customerId = customerRes.rows[0].customer_id;
      // Optionally update phone if it was blank
      await dbQuery('UPDATE tour_customers SET phone = COALESCE(phone, $1) WHERE customer_id = $2', [phone, customerId]);
    }

    // 2. Fetch tour and schedule to calculate price and verify seats
    const tourRes = await dbQuery('SELECT base_price, separate_room_charge FROM tour_tours WHERE tour_id = $1', [tour_id]);
    if (tourRes.rows.length === 0) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    const { base_price, separate_room_charge } = tourRes.rows[0];

    const scheduleRes = await dbQuery('SELECT available_seats FROM tour_schedules WHERE schedule_id = $1', [schedule_id]);
    if (scheduleRes.rows.length === 0) return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    const { available_seats } = scheduleRes.rows[0];

    if (available_seats < seats) {
      return NextResponse.json({ error: 'Not enough seats available' }, { status: 400 });
    }

    // 3. Calculate price
    const isSeparateRoomEligible = separate_room && seats >= 2;
    const total_price = (Number(base_price) * Number(seats)) + (isSeparateRoomEligible ? Number(separate_room_charge) : 0);

    return await withTransaction(async (client) => {
      // 4. Double check and deduct seats
      const currentScheduleRes = await client.query('SELECT available_seats FROM tour_schedules WHERE schedule_id = $1 FOR UPDATE', [schedule_id]);
      if (currentScheduleRes.rows[0].available_seats < seats) {
        throw new Error('Not enough seats available');
      }

      await client.query(
        'UPDATE tour_schedules SET available_seats = available_seats - $1 WHERE schedule_id = $2',
        [seats, schedule_id]
      );

      // 5. Insert booking
      const bookingRes = await client.query(
        `INSERT INTO tour_bookings 
          (tenant_id, customer_id, tour_id, schedule_id, seats, total_price, phone, transaction_id, separate_room, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending') RETURNING booking_id`,
        [tenant_id, customerId, tour_id, schedule_id, seats, total_price, phone, transaction_id, isSeparateRoomEligible]
      );

      const bookingId = bookingRes.rows[0].booking_id;

      // 6. Create payment record
      await client.query(
        `INSERT INTO tour_payments (booking_id, amount, provider, transaction_id, status)
         VALUES ($1, $2, $3, $4, 'pending')`,
        [bookingId, total_price, provider || 'stripe', transaction_id]
      );

      return NextResponse.json({ success: true, booking_id: bookingId });
    });
  } catch (error) {
    if (error.message === 'Not enough seats available') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Create Booking Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
