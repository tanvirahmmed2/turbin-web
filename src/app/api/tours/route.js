import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET(req) {
  try {
    const tenantId = await getTenantId();

    const result = await dbQuery(
      `SELECT 
        t.tour_id, t.title, t.slug, t.description, t.starting_location, t.finish_location, t.base_price, t.duration, t.separate_room_available, t.separate_room_charge, t.status, t.created_at,
        (
          SELECT COALESCE(json_agg(json_build_object('spot_id', s.spot_id, 'name', s.name, 'image', s.image)), '[]'::json)
          FROM tour_tour_spots ts
          JOIN tour_spots s ON ts.spot_id = s.spot_id
          WHERE ts.tour_id = t.tour_id
        ) as spots
       FROM tour_tours t
       WHERE t.tenant_id = $1 AND t.status = 'active'
       ORDER BY t.created_at DESC
       LIMIT 6`,
      [tenantId]
    );

    return NextResponse.json({ tours: result.rows });
  } catch (error) {
    console.error('Fetch Tours Error:', error);
    // Return empty tours array if the database connection fails
    return NextResponse.json({ tours: [] });
  }
}
