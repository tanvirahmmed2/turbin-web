import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSessionFromRequest, unauthorizedResponse, errorResponse } from '@/lib/api';

// GET /api/dashboard/tours/[tourId]
export async function GET(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  const { tourId } = await params;
  try {
    const res = await query(`
      SELECT tour_id AS id, title, description, location,
             base_price AS price, status, created_at
      FROM tour_tours
      WHERE tour_id = $1 AND tenant_id = $2
    `, [tourId, session.tenant_id]);

    if (!res.rows[0]) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    return NextResponse.json({ tour: res.rows[0] });
  } catch (err) {
    return errorResponse(err, `GET /api/dashboard/tours/${tourId}`);
  }
}

// PATCH /api/dashboard/tours/[tourId]
export async function PATCH(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  const { tourId } = await params;
  try {
    const body = await request.json();
    const { title, description, location, base_price, status } = body;

    const res = await query(`
      UPDATE tour_tours
      SET title        = COALESCE($3, title),
          description  = COALESCE($4, description),
          location     = COALESCE($5, location),
          base_price   = COALESCE($6, base_price),
          status       = COALESCE($7, status)
      WHERE tour_id = $1 AND tenant_id = $2
      RETURNING tour_id AS id, title, status, base_price AS price
    `, [tourId, session.tenant_id, title, description, location,
        base_price    ? parseFloat(base_price)  : null,
        status]);

    if (!res.rows[0]) return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    return NextResponse.json({ tour: res.rows[0] });
  } catch (err) {
    return errorResponse(err, `PATCH /api/dashboard/tours/${tourId}`);
  }
}

// DELETE /api/dashboard/tours/[tourId]
export async function DELETE(request, { params }) {
  const session = getSessionFromRequest(request);
  if (!session || !session.tenant_id) return unauthorizedResponse();

  const { tourId } = await params;
  try {
    await query(`DELETE FROM tour_tours WHERE tour_id = $1 AND tenant_id = $2`, [tourId, session.tenant_id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(err, `DELETE /api/dashboard/tours/${tourId}`);
  }
}
