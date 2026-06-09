import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET(req) {
  try {
    const tenantId = await getTenantId();

    const result = await dbQuery(
      'SELECT website_id, logo_url, theme_color, hero_title, hero_subtitle FROM tour_websites WHERE tenant_id = $1',
      [tenantId]
    );

    if (result.rows.length === 0) {
      // Fallback default config if none is set
      return NextResponse.json({
        tenantId,
        website: {
          hero_title: 'Discover the World with Us',
          hero_subtitle: 'Book your next adventure and create unforgettable memories.',
          theme_color: '#3B82F6',
          logo_url: null,
        }
      });
    }

    return NextResponse.json({ tenantId, website: result.rows[0] });
  } catch (error) {
    console.error('Fetch Website Config Error:', error);
    
    // Return a default fallback if the database connection fails
    return NextResponse.json({
      tenantId: 1,
      website: {
        hero_title: 'Discover the World with Us',
        hero_subtitle: 'Book your next adventure and create unforgettable memories.',
        theme_color: '#3B82F6',
        logo_url: null,
      }
    });
  }
}
