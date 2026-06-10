import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET(req, { params }) {
  try {
    const tenantId = await getTenantId();
    const { tourId } = params;

    // Fetch the main tour details
    const tourRes = await dbQuery(
      `SELECT tour_id, title, slug, description, location, base_price, status, created_at 
       FROM tour_tours 
       WHERE tour_id = $1 AND tenant_id = $2 AND status = 'active'`,
      [tourId, tenantId]
    );

    if (tourRes.rows.length === 0) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const tour = tourRes.rows[0];

    // Fetch itinerary (activities)
    const activitiesRes = await dbQuery(
      `SELECT activity_id, title, description, day_number, start_time, end_time, location 
       FROM tour_activities 
       WHERE tour_id = $1 
       ORDER BY day_number ASC, start_time ASC`,
      [tourId]
    );

    // Fetch upcoming schedules
    const schedulesRes = await dbQuery(
      `SELECT schedule_id, tour_date, start_time, end_time, last_registration_date, max_seats, available_seats 
       FROM tour_schedules 
       WHERE tour_id = $1 AND tour_date >= CURRENT_DATE 
       ORDER BY tour_date ASC`,
      [tourId]
    );

    // Fetch spots
    const spotsRes = await dbQuery(
      `SELECT s.spot_id, s.name, s.description, s.location, s.image, s.image_id 
       FROM tour_spots s
       JOIN tour_tour_spots ts ON s.spot_id = ts.spot_id
       WHERE ts.tour_id = $1`,
      [tourId]
    );

    return NextResponse.json({
      tour: {
        ...tour,
        activities: activitiesRes.rows,
        schedules: schedulesRes.rows,
        spots: spotsRes.rows,
      }
    });
  } catch (error) {
    console.error('Fetch Single Tour Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
