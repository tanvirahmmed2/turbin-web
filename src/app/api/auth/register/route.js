import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/db';
import { hashPassword, signToken, buildSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, tenant_slug } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required: name, email, password' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const emailLower = email.toLowerCase().trim();

    // Check if email is already registered based on context
    const checkTable = tenant_slug ? 'tour_users' : 'ts_users';
    const existingUser = await query(
      `SELECT user_id FROM ${checkTable} WHERE email = $1 LIMIT 1`,
      [emailLower]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    let result;

    if (tenant_slug) {
      // TENANT DOMAIN REGISTRATION (Registering as a user under an existing tenant)
      result = await withTransaction(async (client) => {
        const tenantCheck = await client.query(
          `SELECT t.tenant_id, t.name, t.slug 
           FROM ts_tenants t
           LEFT JOIN ts_domains d ON d.tenant_id = t.tenant_id
           WHERE t.slug = $1 OR d.domain = $1 LIMIT 1`, 
          [tenant_slug]
        );
        if (tenantCheck.rows.length === 0) {
          throw new Error('Tenant not found');
        }
        const tenant = tenantCheck.rows[0];

        // Insert user with 'customer' role
        const userResult = await client.query(
          `INSERT INTO tour_users (tenant_id, name, email, password, role)
           VALUES ($1, $2, $3, $4, 'customer') RETURNING *`,
          [tenant.tenant_id, name, emailLower, hashedPassword]
        );

        // Insert into tour_customers
        await client.query(
          `INSERT INTO tour_customers (tenant_id, name, email)
           VALUES ($1, $2, $3)`,
          [tenant.tenant_id, name, emailLower]
        );

        return { tenant, user: userResult.rows[0], type: 'tenant' };
      });

    } else {
      // ROOT DOMAIN REGISTRATION (Creating a new SaaS User)
      // Tenant is NOT created here. It is created during checkout/purchase.
      result = await withTransaction(async (client) => {
        const userResult = await client.query(
          `INSERT INTO ts_users (name, email, password, role)
           VALUES ($1, $2, $3, 'customer') RETURNING *`,
          [name, emailLower, hashedPassword]
        );
        
        return { user: userResult.rows[0], type: 'saas' };
      });
    }

    // Issue JWT for immediate login after registration
    const tokenPayload = {
      user_id: result.user.user_id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    };

    if (result.type === 'tenant') {
      tokenPayload.tenant_id = result.tenant.tenant_id;
      tokenPayload.tenant_slug = result.tenant.slug;
    }

    const token = signToken(tokenPayload);
    const cookie = buildSessionCookie(token);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          ...tokenPayload,
          tenant_name: result.tenant?.name,
        },
      },
      { status: 201 }
    );

    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (err) {
    console.error('[POST /api/auth/register]', err);
    if (err.message === 'Tenant not found') {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
