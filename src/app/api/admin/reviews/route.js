import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !['owner', 'manager'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const tenantId = await getTenantId();

    const result = await dbQuery(
      `SELECT 
        r.review_id, r.rating, r.comment, r.is_approved, r.created_at,
        c.name as customer_name, c.email as customer_email
       FROM tour_reviews r
       JOIN tour_customers c ON r.customer_id = c.customer_id
       WHERE c.tenant_id = $1 
       ORDER BY r.created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ reviews: result.rows });
  } catch (error) {
    console.error('Fetch Reviews Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !['owner', 'manager'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { review_id, is_approved } = await req.json();

    if (!review_id) return NextResponse.json({ error: 'Missing review_id' }, { status: 400 });

    const tenantId = await getTenantId();

    // Verify ownership indirectly by joining
    const check = await dbQuery(
      `SELECT r.review_id FROM tour_reviews r
       JOIN tour_customers c ON r.customer_id = c.customer_id
       WHERE r.review_id = $1 AND c.tenant_id = $2`,
      [review_id, tenantId]
    );

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Review not found or forbidden' }, { status: 403 });
    }

    await dbQuery(
      `UPDATE tour_reviews SET is_approved = $1 WHERE review_id = $2`,
      [is_approved, review_id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Review Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || !['owner', 'manager'].includes(decoded.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Need to get review_id from URL search params since it's a DELETE request
    const { searchParams } = new URL(req.url);
    const review_id = searchParams.get('review_id');

    if (!review_id) return NextResponse.json({ error: 'Missing review_id' }, { status: 400 });

    const tenantId = await getTenantId();

    // Verify ownership indirectly by joining
    const check = await dbQuery(
      `SELECT r.review_id FROM tour_reviews r
       JOIN tour_customers c ON r.customer_id = c.customer_id
       WHERE r.review_id = $1 AND c.tenant_id = $2`,
      [review_id, tenantId]
    );

    if (check.rows.length === 0) {
      return NextResponse.json({ error: 'Review not found or forbidden' }, { status: 403 });
    }

    await dbQuery(
      `DELETE FROM tour_reviews WHERE review_id = $1`,
      [review_id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Review Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
