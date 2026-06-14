import { NextResponse } from 'next/server';
import { dbQuery, transaction } from '@/lib/db';
import { getSession } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager', 'guide'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;

    // Fetch tours with spot counts
    const result = await dbQuery(
      `SELECT t.tour_id, t.title, t.slug, t.duration, t.starting_location, t.finish_location, t.base_price, t.separate_room_available, t.separate_room_charge, t.status, t.created_at, 
              COUNT(ts.spot_id) as spots_count
       FROM tour_tours t
       LEFT JOIN tour_tour_spots ts ON t.tour_id = ts.tour_id
       WHERE t.tenant_id = $1 
       GROUP BY t.tour_id
       ORDER BY t.created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ tours: result.rows });
  } catch (error) {
    console.error('Admin Tours Fetch Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    const body = await req.json();
    const { title, description, duration, starting_location, finish_location, base_price, separate_room_available = false, separate_room_charge = 0.00, spots = [], features = [], schedules = [], guides = [] } = body;

    const slug = title ? slugify(title, { lower: true, strict: true }) : '';

    const tourId = await transaction(async (client) => {
      // 1. Insert tour
      const tourResult = await client.query(
        `INSERT INTO tour_tours (tenant_id, title, slug, description, duration, starting_location, finish_location, base_price, separate_room_available, separate_room_charge) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING tour_id`,
        [tenantId, title, slug, description, duration, starting_location, finish_location, base_price, separate_room_available, separate_room_charge]
      );
      const newTourId = tourResult.rows[0].tour_id;

      // 2. Insert spots and link them
      for (const spot of spots) {
        let spotId = spot.spot_id;
        
        // If it's a new spot, insert it first
        if (!spotId) {
          const spotResult = await client.query(
            `INSERT INTO tour_spots (tenant_id, name, description, location, image, image_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING spot_id`,
            [tenantId, spot.name, spot.description, spot.location, spot.image, spot.image_id]
          );
          spotId = spotResult.rows[0].spot_id;
        }
        
        // Link spot to tour
        await client.query(
          `INSERT INTO tour_tour_spots (tour_id, spot_id) VALUES ($1, $2)`,
          [newTourId, spotId]
        );
      }
      
      // 3. Insert features
      if (features && features.length > 0) {
        for (const feature of features) {
          if (feature.feature_id) {
            await client.query(
              `INSERT INTO tour_tour_features (tour_id, feature_id) VALUES ($1, $2)`,
              [newTourId, feature.feature_id]
            );
          }
        }
      }
      
      // 4. Insert schedules
      if (schedules && schedules.length > 0) {
        for (const schedule of schedules) {
          await client.query(
            `INSERT INTO tour_schedules (tour_id, tour_date, start_time, end_time, last_registration_date, max_seats, available_seats) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              newTourId, 
              schedule.tour_date, 
              schedule.start_time || null, 
              schedule.end_time || null, 
              schedule.last_registration_date, 
              schedule.max_seats, 
              schedule.max_seats // Set available to max by default
            ]
          );
        }
      }
      
      // 5. Insert guides
      if (guides && guides.length > 0) {
        for (const guide of guides) {
          if (guide.user_id) {
            await client.query(
              `INSERT INTO tour_assigned_guides (tour_id, guide_id) VALUES ($1, $2)`,
              [newTourId, guide.user_id]
            );
          }
        }
      }
      
      return newTourId;
    });

    return NextResponse.json({ success: true, tour_id: tourId });
  } catch (error) {
    console.error('Admin Create Tour Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
