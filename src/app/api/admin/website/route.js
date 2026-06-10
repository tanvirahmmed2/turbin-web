import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden. Only owners can update website settings.' }, { status: 403 });
    }

    const tenantId = await getTenantId();
    const data = await req.json();

    const {
      hero_title,
      hero_subtitle,
      theme_color,
      logo_url,
      name,
      address,
      tagline,
      sociallink,
      email,
      phone
    } = data;

    // Check if website record exists
    const existing = await dbQuery('SELECT website_id FROM tour_websites WHERE tenant_id = $1', [tenantId]);

    if (existing.rows.length === 0) {
      // Insert
      await dbQuery(
        `INSERT INTO tour_websites (tenant_id, hero_title, hero_subtitle, theme_color, logo_url, name, address, tagline, sociallink, email, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [tenantId, hero_title, hero_subtitle, theme_color, logo_url, name, address, tagline, sociallink, email, phone]
      );
    } else {
      // Update
      await dbQuery(
        `UPDATE tour_websites 
         SET hero_title = $1, hero_subtitle = $2, theme_color = $3, logo_url = $4, name = $5, address = $6, tagline = $7, sociallink = $8, email = $9, phone = $10, updated_at = NOW()
         WHERE tenant_id = $11`,
        [hero_title, hero_subtitle, theme_color, logo_url, name, address, tagline, sociallink, email, phone, tenantId]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Website Settings Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
