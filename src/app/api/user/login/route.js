import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const tenantId = await getTenantId();

    const result = await dbQuery(
      'SELECT * FROM tour_users WHERE email = $1 AND tenant_id = $2',
      [email, tenantId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.is_verified) {
      return NextResponse.json({ error: 'Please verify your account before logging in. Check your email for the verification link.' }, { status: 403 });
    }

    const token = signToken({
      user_id: user.user_id,
      tenant_id: tenantId,
      role: user.role,
      email: user.email,
    });

    // Remove password from response
    delete user.password;

    const response = NextResponse.json({ user });
    
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
