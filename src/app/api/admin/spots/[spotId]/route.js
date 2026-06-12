import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    const { spotId } = await params;
    const body = await req.json();
    const { name, description, location, image, image_id } = body;

    await dbQuery(
      `UPDATE tour_spots 
       SET name = $1, description = $2, location = $3, image = $4, image_id = $5
       WHERE spot_id = $6 AND tenant_id = $7`,
      [name, description, location, image, image_id, spotId, tenantId]
    );

    return NextResponse.json({ success: true, message: 'Spot updated successfully' });
  } catch (error) {
    console.error('Admin Update Spot Error:', error);
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
    const { spotId } = await params;

    await dbQuery(
      `DELETE FROM tour_spots WHERE spot_id = $1 AND tenant_id = $2`,
      [spotId, tenantId]
    );

    return NextResponse.json({ success: true, message: 'Spot deleted successfully' });
  } catch (error) {
    console.error('Admin Delete Spot Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
