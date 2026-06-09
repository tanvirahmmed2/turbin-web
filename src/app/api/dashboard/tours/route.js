import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

// GET /api/dashboard/tours — list all tours
export async function GET(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const res = await query(`
      SELECT tour_id AS id, title, status, base_price AS price,
             location, created_at
      FROM tour_tours
      WHERE tenant_id = $1
      ORDER BY created_at DESC
    `, [session.tenant_id]);

    return NextResponse.json({ tours: res.rows });
  } catch (err) {
    return errorResponse(err, 'GET /api/dashboard/tours');
  }
}

// POST /api/dashboard/tours — create a new tour
export async function POST(request) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  try {
    const body = await request.json();
    const { title, description, location, base_price, status } = body;

    if (!title || !base_price) {
      return NextResponse.json({ error: 'title and base_price are required' }, { status: 400 });
    }

    const res = await query(`
      INSERT INTO tour_tours (tenant_id, title, description, location, base_price, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING tour_id AS id, title, status, base_price AS price, created_at
    `, [
      session.tenant_id,
      title,
      description || '',
      location || '',
      parseFloat(base_price),
      status || 'draft',
    ]);

    return NextResponse.json({ tour: res.rows[0] }, { status: 201 });
  } catch (err) {
    return errorResponse(err, 'POST /api/dashboard/tours');
  }
}
