import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getSession();
    if (!user || !user.tenant_id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await query('SELECT * FROM ts_domains WHERE tenant_id = $1 ORDER BY is_primary DESC, created_at ASC', [user.tenant_id]);
    return NextResponse.json(res.rows);
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSession();
    if (!user || !user.tenant_id || user.role !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { domain } = await request.json();
    if (!domain) return NextResponse.json({ error: 'Domain is required' }, { status: 400 });

    const check = await query('SELECT domain_id FROM ts_domains WHERE domain = $1', [domain]);
    if (check.rows.length > 0) return NextResponse.json({ error: 'Domain already in use' }, { status: 400 });

    await query('INSERT INTO ts_domains (tenant_id, domain, verified) VALUES ($1, $2, false)', [user.tenant_id, domain]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getSession();
    if (!user || !user.tenant_id || user.role !== 'owner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { domainId } = await request.json();
    if (!domainId) return NextResponse.json({ error: 'Domain ID required' }, { status: 400 });

    // Ensure they own it and it's verified
    const check = await query('SELECT * FROM ts_domains WHERE domain_id = $1 AND tenant_id = $2', [domainId, user.tenant_id]);
    if (check.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!check.rows[0].verified) return NextResponse.json({ error: 'Domain must be verified first' }, { status: 400 });

    await query('UPDATE ts_domains SET is_primary = false WHERE tenant_id = $1', [user.tenant_id]);
    await query('UPDATE ts_domains SET is_primary = true WHERE domain_id = $1', [domainId]);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getSession();
    if (!user || !user.tenant_id || user.role !== 'owner') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const domainId = request.nextUrl.searchParams.get('id');
    if (!domainId) return NextResponse.json({ error: 'Domain ID required' }, { status: 400 });

    // Cannot delete if it's the primary or a tourera.com subdomain (we'll just check primary)
    const check = await query('SELECT * FROM ts_domains WHERE domain_id = $1 AND tenant_id = $2', [domainId, user.tenant_id]);
    if (check.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (check.rows[0].is_primary) return NextResponse.json({ error: 'Cannot delete primary domain' }, { status: 400 });
    if (check.rows[0].domain.endsWith('.tourera.com')) return NextResponse.json({ error: 'Cannot delete default subdomain' }, { status: 400 });

    await query('DELETE FROM ts_domains WHERE domain_id = $1', [domainId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
