import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, signToken, buildSessionCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, tenant_slug } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const host = request.headers.get('host');
    const SAAS_DOMAIN = process.env.SAAS_DOMAIN || 'localhost:3000';
    const isSaas = host === SAAS_DOMAIN || host === 'tourera.com';

    let user = null;
    let tenantName = null;
    let tenantSlug = null;

    if (isSaas) {
      // Check super admins in ts_users
      const saasResult = await query(`SELECT * FROM ts_users WHERE email = $1 LIMIT 1`, [email.toLowerCase().trim()]);
      if (saasResult.rows.length > 0) {
        user = saasResult.rows[0];
      } else {
        // Check tenant owners/staff logging into the SaaS dashboard
        const tenantResult = await query(`
          SELECT u.*, t.slug AS tenant_slug, t.name AS tenant_name
          FROM tour_users u
          JOIN ts_tenants t ON t.tenant_id = u.tenant_id
          WHERE u.email = $1 AND t.status = 'active'
          LIMIT 1
        `, [email.toLowerCase().trim()]);
        
        if (tenantResult.rows.length > 0) {
          user = tenantResult.rows[0];
          tenantName = user.tenant_name;
          tenantSlug = user.tenant_slug;
        }
      }
    } else {
      // Tenant domain login
      let queryStr = `
        SELECT u.*, t.slug AS tenant_slug, t.name AS tenant_name
        FROM tour_users u
        JOIN ts_tenants t ON t.tenant_id = u.tenant_id
        LEFT JOIN ts_domains d ON d.tenant_id = t.tenant_id
        WHERE u.email = $1 AND t.status = 'active'
      `;
      let queryParams = [email.toLowerCase().trim()];

      if (tenant_slug) {
        queryStr += ` AND (t.slug = $2 OR d.domain = $2)`;
        queryParams.push(tenant_slug);
      }
      queryStr += ` LIMIT 1`;
      
      const result = await query(queryStr, queryParams);
      if (result.rows.length > 0) {
        user = result.rows[0];
        tenantName = user.tenant_name;
        tenantSlug = user.tenant_slug;
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const tokenPayload = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.tenant_id) {
      tokenPayload.tenant_id = user.tenant_id;
    }
    if (tenantSlug) {
      tokenPayload.tenant_slug = tenantSlug;
    }

    const token = signToken(tokenPayload);
    const cookie = buildSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      user: {
        ...tokenPayload,
        tenant_name: user.tenant_name,
      },
    });

    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (err) {
    console.error('[POST /api/auth/login]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
