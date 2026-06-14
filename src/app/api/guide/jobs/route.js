import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session || session.role !== 'guide') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    const userId = session.user_id;

    // Fetch schedules for tours assigned to this guide
    const jobsRes = await dbQuery(
      `SELECT 
         s.schedule_id as id,
         t.title,
         s.tour_date as date,
         s.start_time as time,
         (s.max_seats - s.available_seats) as pax,
         t.starting_location as location,
         CASE 
           WHEN s.tour_date > CURRENT_DATE THEN 'upcoming'
           WHEN s.tour_date = CURRENT_DATE THEN 'today'
           ELSE 'completed'
         END as status
       FROM tour_schedules s
       JOIN tour_tours t ON s.tour_id = t.tour_id
       JOIN tour_assigned_guides ag ON t.tour_id = ag.tour_id
       WHERE ag.guide_id = $1 AND t.tenant_id = $2
       ORDER BY s.tour_date ASC, s.start_time ASC`,
      [userId, tenantId]
    );

    return NextResponse.json({ jobs: jobsRes.rows });
  } catch (error) {
    console.error('Guide Jobs Fetch Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
