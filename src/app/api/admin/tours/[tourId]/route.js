import { NextResponse } from 'next/server';
import { dbQuery, transaction } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager', 'staff'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    const { tourId } = params;

    const tourRes = await dbQuery(
      `SELECT tour_id, title, description, starting_location, finish_location, base_price, status 
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

    return NextResponse.json({ 
      tour: {
        ...tourRes.rows[0],
        spots: spotsRes.rows
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
    const { tourId } = params;
    const body = await req.json();
    const { title, description, starting_location, finish_location, base_price, status, spots = [] } = body;

    await transaction(async (client) => {
      // 1. Update tour details
      await client.query(
        `UPDATE tour_tours 
         SET title = $1, description = $2, starting_location = $3, finish_location = $4, base_price = $5, status = COALESCE($6, status)
         WHERE tour_id = $7 AND tenant_id = $8`,
        [title, description, starting_location, finish_location, base_price, status, tourId, tenantId]
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
    const { tourId } = params;

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
