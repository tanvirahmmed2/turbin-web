import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET(req, { params }) {
  try {
    const tenantId = await getTenantId();
    const { spotId } = await params;

    // Fetch spot details
    const spotRes = await dbQuery(
      `SELECT spot_id, name, description, location, image 
       FROM tour_spots 
       WHERE spot_id = $1 AND tenant_id = $2`,
      [spotId, tenantId]
    );

    if (spotRes.rows.length === 0) {
      return NextResponse.json({ error: 'Spot not found' }, { status: 404 });
    }

    const spot = spotRes.rows[0];

    // Fetch related active tours that include this spot
    const toursRes = await dbQuery(
      `SELECT t.tour_id, t.title, t.slug, t.description, t.starting_location, t.finish_location, t.base_price, t.duration
       FROM tour_tours t
       JOIN tour_tour_spots ts ON t.tour_id = ts.tour_id
       WHERE ts.spot_id = $1 AND t.tenant_id = $2 AND t.status = 'active'
       ORDER BY t.created_at DESC`,
      [spotId, tenantId]
    );

    return NextResponse.json({ 
      spot: {
        ...spot,
        tours: toursRes.rows
      }
    });
  } catch (error) {
    console.error('Fetch Single Spot Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
