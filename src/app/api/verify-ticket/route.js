import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET(req) {
  try {
    const tenantId = await getTenantId();
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('booking_id');

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }

    const bookingRes = await dbQuery(
      `SELECT 
         b.booking_id, b.status, b.seats, b.total_price, b.created_at, b.phone, b.transaction_id, b.separate_room,
         t.title as tour_title, t.slug as tour_slug, t.starting_location, t.finish_location, t.duration,
         (
           SELECT COALESCE(json_agg(json_build_object('name', s.name, 'location', s.location)), '[]'::json)
           FROM tour_tour_spots ts
           JOIN tour_spots s ON ts.spot_id = s.spot_id
           WHERE ts.tour_id = t.tour_id
         ) as tour_spots,
         (
           SELECT COALESCE(json_agg(json_build_object('name', f.name)), '[]'::json)
           FROM tour_tour_features tf
           JOIN tour_features f ON tf.feature_id = f.feature_id
           WHERE tf.tour_id = t.tour_id
         ) as tour_features,
         s.tour_date, s.start_time, s.end_time,
         c.name as customer_name, c.email as customer_email
       FROM tour_bookings b
       JOIN tour_tours t ON b.tour_id = t.tour_id
       JOIN tour_schedules s ON b.schedule_id = s.schedule_id
       JOIN tour_customers c ON b.customer_id = c.customer_id
       WHERE b.booking_id = $1 AND b.tenant_id = $2`,
      [bookingId, tenantId]
    );

    if (bookingRes.rows.length === 0) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const booking = bookingRes.rows[0];

    return NextResponse.json({ ticket: booking });
  } catch (error) {
    console.error('Verify Ticket Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
