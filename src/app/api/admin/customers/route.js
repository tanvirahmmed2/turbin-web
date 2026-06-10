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
      `SELECT customer_id, name, email, phone, total_bookings, created_at 
       FROM tour_customers 
       WHERE tenant_id = $1 
       ORDER BY created_at DESC`,
      [tenantId]
    );

    return NextResponse.json({ customers: result.rows });
  } catch (error) {
    console.error('Fetch Customers Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
