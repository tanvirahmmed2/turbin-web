import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;

    const result = await dbQuery(
      `SELECT spot_id, name, description, location, image, image_id, created_at 
       FROM tour_spots 
       WHERE tenant_id = $1 
       ORDER BY created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ spots: result.rows });
  } catch (error) {
    console.error('Admin Spots Fetch Error:', error);
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
    const { name, description, location, image, image_id } = body;

    const result = await dbQuery(
      `INSERT INTO tour_spots (tenant_id, name, description, location, image, image_id) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING spot_id`,
      [tenantId, name, description, location, image, image_id]
    );

    return NextResponse.json({ success: true, spot_id: result.rows[0].spot_id });
  } catch (error) {
    console.error('Admin Create Spot Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
