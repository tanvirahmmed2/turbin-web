import { NextResponse } from 'next/server';
import { dbQuery, withTransaction } from '@/lib/db';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(req) {
  try {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, tenant_id } = session;

    const result = await dbQuery(
      `SELECT name, email, phone FROM tour_customers WHERE email = $1 AND tenant_id = $2`,
      [email, tenant_id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: result.rows[0] });
  } catch (error) {
    console.error('Fetch Settings Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, tenant_id } = session;
    const body = await req.json();
    const { name, phone, current_password, new_password } = body;

    await withTransaction(async (client) => {
      // 1. Update Profile Information (if provided)
      if (name) {
        await client.query(
          `UPDATE tour_customers SET name = $1, phone = $2 WHERE email = $3 AND tenant_id = $4`,
          [name, phone, email, tenant_id]
        );
        
        await client.query(
          `UPDATE tour_users SET name = $1 WHERE email = $2 AND tenant_id = $3 AND role = 'customer'`,
          [name, email, tenant_id]
        );
      }

      // 2. Handle Password Update (if provided)
      if (current_password && new_password) {
        const userRes = await client.query(
          `SELECT password FROM tour_users WHERE email = $1 AND tenant_id = $2 AND role = 'customer'`,
          [email, tenant_id]
        );

        if (userRes.rows.length === 0) {
          throw new Error('User not found');
        }

        const validPassword = await bcrypt.compare(current_password, userRes.rows[0].password);
        if (!validPassword) {
          const err = new Error('Invalid current password');
          err.status = 400;
          throw err;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        await client.query(
          `UPDATE tour_users SET password = $1 WHERE email = $2 AND tenant_id = $3 AND role = 'customer'`,
          [hashedPassword, email, tenant_id]
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Settings Error:', error);
    if (error.status === 400) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = getSession(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { email, tenant_id } = session;

    await withTransaction(async (client) => {
      // Delete from tour_users
      await client.query(
        `DELETE FROM tour_users WHERE email = $1 AND tenant_id = $2 AND role = 'customer'`,
        [email, tenant_id]
      );
      
      // Delete from tour_customers
      // (This should cascade and delete reviews, tickets, bookings, etc. depending on schema)
      await client.query(
        `DELETE FROM tour_customers WHERE email = $1 AND tenant_id = $2`,
        [email, tenant_id]
      );
    });

    // Note: The client will need to clear their auth token cookie
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Account Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
