import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { slug, id } = await params;
    const scheduleId = request.nextUrl.searchParams.get('schedule');
    
    if (!scheduleId) return NextResponse.json({ error: 'Schedule required' }, { status: 400 });

    const res = await query(`
      SELECT t.tour_id, t.title, t.base_price,
             tn.tenant_id, tn.name AS tenant_name,
             s.schedule_id, s.tour_date, s.start_time, s.available_seats
      FROM tour_tours t
      JOIN ts_tenants tn ON t.tenant_id = tn.tenant_id
      LEFT JOIN ts_domains d ON d.tenant_id = tn.tenant_id
      JOIN tour_schedules s ON s.tour_id = t.tour_id
      WHERE (d.domain = $1 OR tn.slug = $1) AND t.tour_id = $2 AND s.schedule_id = $3 AND t.status = 'active'
      LIMIT 1
    `, [slug, id, scheduleId]);

    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(res.rows[0]);
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { tenantId, tourId, scheduleId, seats, totalPrice, name, email, phone } = body;

    if (!tenantId || !tourId || !scheduleId || !seats || !name || !email) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const schedRes = await query(`SELECT available_seats FROM tour_schedules WHERE schedule_id = $1`, [scheduleId]);
    if (schedRes.rows.length === 0) return NextResponse.json({ error: 'Schedule not found.' }, { status: 404 });
    if (schedRes.rows[0].available_seats < seats) return NextResponse.json({ error: 'Not enough seats available.' }, { status: 400 });

    let customerId;
    const custRes = await query(`SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2`, [email.toLowerCase(), tenantId]);
    if (custRes.rows.length > 0) {
      customerId = custRes.rows[0].customer_id;
      if (phone) {
        await query(`UPDATE tour_customers SET phone = $1 WHERE customer_id = $2`, [phone, customerId]);
      }
    } else {
      const newCust = await query(
        `INSERT INTO tour_customers (tenant_id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING customer_id`,
        [tenantId, name, email.toLowerCase(), phone || null]
      );
      customerId = newCust.rows[0].customer_id;
    }

    const bookRes = await query(
      `INSERT INTO tour_bookings (tenant_id, customer_id, tour_id, schedule_id, seats, total_price, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING booking_id`,
      [tenantId, customerId, tourId, scheduleId, seats, totalPrice]
    );

    await query(`UPDATE tour_schedules SET available_seats = available_seats - $1 WHERE schedule_id = $2`, [seats, scheduleId]);
    await query(`UPDATE tour_customers SET total_bookings = total_bookings + 1 WHERE customer_id = $1`, [customerId]);

    return NextResponse.json({ success: true, bookingId: bookRes.rows[0].booking_id });
  } catch (err) {
    console.error('Booking error:', err);
    return NextResponse.json({ error: 'Internal server error during booking.' }, { status: 500 });
  }
}
