import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session || !['owner', 'manager', 'staff'].includes(session.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tenantId = session.tenant_id;
    
    const result = await dbQuery(
      `SELECT feature_id, name, created_at 
       FROM tour_features 
       WHERE tenant_id = $1 
       ORDER BY created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ features: result.rows });
  } catch (error) {
    console.error('Admin Fetch Features Error:', error);
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
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await dbQuery(
      `INSERT INTO tour_features (tenant_id, name) 
       VALUES ($1, $2) RETURNING feature_id`,
      [tenantId, name]
    );

    return NextResponse.json({ success: true, feature_id: result.rows[0].feature_id });
  } catch (error) {
    console.error('Admin Create Feature Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
