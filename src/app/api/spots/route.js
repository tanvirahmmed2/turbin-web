import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const tenantId = await getTenantId();

    const result = await dbQuery(
      `SELECT spot_id, name, description, location, image 
       FROM tour_spots 
       WHERE tenant_id = $1
       ORDER BY name ASC`,
      [tenantId]
    );

    return NextResponse.json({ spots: result.rows });
  } catch (error) {
    console.error('Fetch Spots Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
