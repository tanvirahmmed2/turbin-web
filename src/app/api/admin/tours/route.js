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
      `SELECT tour_id, title, location, base_price, status, created_at 
       FROM tour_tours 
       WHERE tenant_id = $1 
       ORDER BY created_at DESC`,
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
    const { title, description, location, base_price } = body;

    const result = await dbQuery(
      `INSERT INTO tour_tours (tenant_id, title, description, location, base_price) 
       VALUES ($1, $2, $3, $4, $5) RETURNING tour_id`,
      [tenantId, title, description, location, base_price]
    );

    return NextResponse.json({ success: true, tour_id: result.rows[0].tour_id });
  } catch (error) {
    console.error('Admin Create Tour Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
