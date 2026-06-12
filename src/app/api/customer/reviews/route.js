import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, tenant_id } = session;

    const customerRes = await dbQuery(
      'SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    if (customerRes.rows.length === 0) return NextResponse.json({ reviews: [] });

    const customerId = customerRes.rows[0].customer_id;

    const reviewsRes = await dbQuery(
      `SELECT r.review_id, r.rating, r.comment, r.is_approved, r.created_at, t.title as tour_title 
       FROM tour_reviews r
       JOIN tour_tours t ON r.tour_id = t.tour_id
       WHERE r.customer_id = $1
       ORDER BY r.created_at DESC`,
      [customerId]
    );

    return NextResponse.json({ reviews: reviewsRes.rows });
  } catch (error) {
    console.error('Customer Reviews Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
