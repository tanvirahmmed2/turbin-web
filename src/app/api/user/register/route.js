import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tenantId = await getTenantId();

    // Check if user exists in the tenant
    const existingUser = await dbQuery(
      'SELECT user_id FROM tour_users WHERE email = $1 AND tenant_id = $2',
      [email, tenantId]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into tour_users
    const result = await dbQuery(
      `INSERT INTO tour_users (tenant_id, name, email, password, role) 
       VALUES ($1, $2, $3, $4, 'customer') RETURNING user_id, name, email, role`,
      [tenantId, name, email, hashedPassword]
    );

    const user = result.rows[0];

    // Ensure customer record exists
    const customerResult = await dbQuery(
      `INSERT INTO tour_customers (tenant_id, name, email) 
       VALUES ($1, $2, $3) 
       ON CONFLICT DO NOTHING RETURNING customer_id`,
      [tenantId, name, email]
    );


    // Generate token
    const token = signToken({
      user_id: user.user_id,
      tenant_id: tenantId,
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json({ user });
    
    // Set cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
