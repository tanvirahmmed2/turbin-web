import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET(req, { params }) {
  try {
    const tenantId = await getTenantId();
    const { slug } = await params;

    // Fetch the main tour details
    const tourRes = await dbQuery(
      `SELECT tour_id, title, slug, description, starting_location, finish_location, base_price, separate_room_available, separate_room_charge, status, created_at 
       FROM tour_tours 
       WHERE (slug = $1 OR tour_id::text = $1) AND tenant_id = $2 AND status = 'active'`,
      [slug, tenantId]
    );

    if (tourRes.rows.length === 0) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const tour = tourRes.rows[0];
    const tourId = tour.tour_id;

    // Fetch itinerary (activities) removed as requested.

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

    // Fetch features
    const featuresRes = await dbQuery(
      `SELECT f.feature_id, f.name 
       FROM tour_features f
       JOIN tour_tour_features tf ON f.feature_id = tf.feature_id
       WHERE tf.tour_id = $1
       ORDER BY f.feature_id ASC`,
      [tourId]
    );

    return NextResponse.json({
      tour: {
        ...tour,
        schedules: schedulesRes.rows,
        spots: spotsRes.rows,
        features: featuresRes.rows,
      }
    });
  } catch (error) {
    console.error('Fetch Single Tour Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
