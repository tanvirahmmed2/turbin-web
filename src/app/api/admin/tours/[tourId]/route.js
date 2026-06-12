import { NextResponse } from 'next/server';
import { dbQuery, transaction } from '@/lib/db';
import { getSession } from '@/lib/auth';
import slugify from 'slugify';

export async function GET(req, { params }) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager', 'staff'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    const { tourId } = await params;

    const tourRes = await dbQuery(
      `SELECT tour_id, title, slug, description, duration, starting_location, finish_location, base_price, separate_room_available, separate_room_charge, status 
       FROM tour_tours 
       WHERE tour_id = $1 AND tenant_id = $2`,
      [tourId, tenantId]
    );

    if (tourRes.rows.length === 0) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    const spotsRes = await dbQuery(
      `SELECT s.spot_id, s.name, s.description, s.location, s.image, s.image_id 
       FROM tour_spots s
       JOIN tour_tour_spots ts ON s.spot_id = ts.spot_id
       WHERE ts.tour_id = $1`,
      [tourId]
    );

    const featuresRes = await dbQuery(
      `SELECT f.feature_id, f.name 
       FROM tour_features f
       JOIN tour_tour_features tf ON f.feature_id = tf.feature_id
       WHERE tf.tour_id = $1
       ORDER BY f.feature_id ASC`,
      [tourId]
    );

    const schedulesRes = await dbQuery(
      `SELECT schedule_id, tour_date, start_time, end_time, last_registration_date, max_seats, available_seats 
       FROM tour_schedules 
       WHERE tour_id = $1
       ORDER BY tour_date ASC`,
      [tourId]
    );

    return NextResponse.json({ 
      tour: {
        ...tourRes.rows[0],
        schedules: schedulesRes.rows,
        spots: spotsRes.rows,
        features: featuresRes.rows
      }
    });
  } catch (error) {
    console.error('Admin Fetch Tour Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    const { tourId } = await params;
    const body = await req.json();
    const { title, description, duration, starting_location, finish_location, base_price, separate_room_available = false, separate_room_charge = 0.00, status, spots = [], features = [], schedules = [] } = body;

    const slug = title ? slugify(title, { lower: true, strict: true }) : '';

    await transaction(async (client) => {
      // 1. Update tour details
      await client.query(
        `UPDATE tour_tours 
         SET title = $1, slug = $2, description = $3, duration = $4, starting_location = $5, finish_location = $6, base_price = $7, separate_room_available = $8, separate_room_charge = $9, status = COALESCE($10, status)
         WHERE tour_id = $11 AND tenant_id = $12`,
        [title, slug, description, duration, starting_location, finish_location, base_price, separate_room_available, separate_room_charge, status, tourId, tenantId]
      );

      // 2. Sync spots: delete existing linkages
      await client.query(
        `DELETE FROM tour_tour_spots WHERE tour_id = $1`,
        [tourId]
      );

      // 3. Insert or update new spots and relink
      for (const spot of spots) {
        let spotId = spot.spot_id;
        
        if (!spotId) {
          // It's a new spot
          const spotResult = await client.query(
            `INSERT INTO tour_spots (tenant_id, name, description, location, image, image_id)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING spot_id`,
            [tenantId, spot.name, spot.description, spot.location, spot.image, spot.image_id]
          );
          spotId = spotResult.rows[0].spot_id;
        } else {
          // Update existing spot details if necessary
          await client.query(
            `UPDATE tour_spots 
             SET name = $1, description = $2, location = $3, image = $4, image_id = $5
             WHERE spot_id = $6 AND tenant_id = $7`,
            [spot.name, spot.description, spot.location, spot.image, spot.image_id, spotId, tenantId]
          );
        }
        
        // Relink spot to tour
        await client.query(
          `INSERT INTO tour_tour_spots (tour_id, spot_id) VALUES ($1, $2)`,
          [tourId, spotId]
        );
      }

      // 4. Sync features: delete existing and insert new
      await client.query(
        `DELETE FROM tour_tour_features WHERE tour_id = $1`,
        [tourId]
      );

      if (features && features.length > 0) {
        for (const feature of features) {
          if (feature.feature_id) {
            await client.query(
              `INSERT INTO tour_tour_features (tour_id, feature_id) VALUES ($1, $2)`,
              [tourId, feature.feature_id]
            );
          }
        }
      }

      // 5. Sync schedules
      const existingSchedulesRes = await client.query(`SELECT schedule_id FROM tour_schedules WHERE tour_id = $1`, [tourId]);
      const existingScheduleIds = existingSchedulesRes.rows.map(s => s.schedule_id);
      
      const newScheduleIds = schedules.filter(s => s.schedule_id).map(s => s.schedule_id);
      
      const schedulesToDelete = existingScheduleIds.filter(id => !newScheduleIds.includes(id));
      if (schedulesToDelete.length > 0) {
        await client.query(`DELETE FROM tour_schedules WHERE schedule_id = ANY($1::int[])`, [schedulesToDelete]);
      }

      for (const schedule of schedules) {
        if (schedule.schedule_id) {
          await client.query(
            `UPDATE tour_schedules 
             SET tour_date = $1, start_time = $2, end_time = $3, last_registration_date = $4, max_seats = $5
             WHERE schedule_id = $6`,
            [schedule.tour_date, schedule.start_time || null, schedule.end_time || null, schedule.last_registration_date, schedule.max_seats, schedule.schedule_id]
          );
        } else {
          await client.query(
            `INSERT INTO tour_schedules (tour_id, tour_date, start_time, end_time, last_registration_date, max_seats, available_seats) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [tourId, schedule.tour_date, schedule.start_time || null, schedule.end_time || null, schedule.last_registration_date, schedule.max_seats, schedule.max_seats]
          );
        }
      }
    });

    return NextResponse.json({ success: true, message: 'Tour updated successfully' });
  } catch (error) {
    console.error('Admin Update Tour Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    const { tourId } = await params;

    await dbQuery(
      `DELETE FROM tour_tours WHERE tour_id = $1 AND tenant_id = $2`,
      [tourId, tenantId]
    );

    return NextResponse.json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Admin Delete Tour Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
