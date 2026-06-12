import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager', 'staff'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    const { featureId } = await params;

    const result = await dbQuery(
      `SELECT feature_id, name, created_at 
       FROM tour_features 
       WHERE feature_id = $1 AND tenant_id = $2`,
      [featureId, tenantId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
    }

    return NextResponse.json({ feature: result.rows[0] });
  } catch (error) {
    console.error('Admin Fetch Feature Error:', error);
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
    const { featureId } = await params;
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await dbQuery(
      `UPDATE tour_features 
       SET name = $1
       WHERE feature_id = $2 AND tenant_id = $3`,
      [name, featureId, tenantId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Update Feature Error:', error);
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
    const { featureId } = await params;

    await dbQuery(
      `DELETE FROM tour_features 
       WHERE feature_id = $1 AND tenant_id = $2`,
      [featureId, tenantId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin Delete Feature Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
