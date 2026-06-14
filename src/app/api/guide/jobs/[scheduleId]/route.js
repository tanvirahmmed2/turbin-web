import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const session = getSession(req);
    if (!session || session.role !== 'guide') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    const userId = session.user_id;
    const { scheduleId } = await params;

    // Verify this schedule is assigned to the guide
    const verifyRes = await dbQuery(
      `SELECT s.schedule_id, t.title, t.tour_id, s.tour_date, s.start_time, t.starting_location
       FROM tour_schedules s
       JOIN tour_tours t ON s.tour_id = t.tour_id
       JOIN tour_assigned_guides ag ON t.tour_id = ag.tour_id
       WHERE ag.guide_id = $1 AND s.schedule_id = $2 AND t.tenant_id = $3`,
      [userId, scheduleId, tenantId]
    );

    if (verifyRes.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found or not assigned to you' }, { status: 404 });
    }

    const jobDetails = verifyRes.rows[0];

    // Fetch the manifest (confirmed bookings)
    const manifestRes = await dbQuery(
      `SELECT 
         b.booking_id,
         c.name as customer_name,
         c.email as customer_email,
         b.phone as contact_phone,
         b.seats,
         b.separate_room,
         b.status
       FROM tour_bookings b
       JOIN tour_customers c ON b.customer_id = c.customer_id
       WHERE b.schedule_id = $1 AND b.status IN ('confirmed', 'pending')
       ORDER BY b.created_at ASC`,
      [scheduleId]
    );

    return NextResponse.json({ 
      job: jobDetails,
      manifest: manifestRes.rows 
    });
  } catch (error) {
    console.error('Guide Manifest Fetch Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
