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
      `SELECT review_id, rating, comment, is_approved, created_at 
       FROM tour_reviews
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [customerId]
    );

    return NextResponse.json({ 
      reviews: reviewsRes.rows
    });
  } catch (error) {
    console.error('Customer Reviews Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, tenant_id } = session;
    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const customerRes = await dbQuery(
      'SELECT customer_id FROM tour_customers WHERE email = $1 AND tenant_id = $2',
      [email, tenant_id]
    );

    if (customerRes.rows.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const customerId = customerRes.rows[0].customer_id;

    const insertRes = await dbQuery(
      `INSERT INTO tour_reviews 
       (customer_id, rating, comment, is_approved) 
       VALUES ($1, $2, $3, FALSE) 
       RETURNING review_id, rating, comment, is_approved, created_at`,
      [customerId, rating, comment]
    );

    const newReview = insertRes.rows[0];

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Create Review Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
