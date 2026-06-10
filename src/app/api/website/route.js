import { NextResponse } from 'next/server';
import { dbQuery } from '@/lib/db';
import { getTenantId } from '@/lib/tenant';

export async function GET(req) {
  try {
    const tenantId = await getTenantId();

    const result = await dbQuery(
      'SELECT website_id, logo_url, theme_color, hero_title, hero_subtitle, name, address, tagline, sociallink, email, phone FROM tour_websites WHERE tenant_id = $1',
      [tenantId]
    );

    const defaultWebsite = {
      hero_title: 'Discover the World with Us',
      hero_subtitle: 'Book your next adventure and create unforgettable memories.',
      theme_color: '#3B82F6',
      logo_url: null,
      name: 'TourApp',
      address: '123 Adventure Way, Wanderlust City, WL 12345',
      tagline: 'Discover breathtaking destinations and create unforgettable memories with our curated travel experiences.',
      sociallink: '#',
      email: 'hello@tourapp.com',
      phone: '+1 (555) 123-4567'
    };

    if (result.rows.length === 0) {
      // Fallback default config if none is set
      return NextResponse.json({
        tenantId,
        website: defaultWebsite
      });
    }

    return NextResponse.json({ tenantId, website: { ...defaultWebsite, ...result.rows[0] } });
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
        name: 'TourApp',
        address: '123 Adventure Way, Wanderlust City, WL 12345',
        tagline: 'Discover breathtaking destinations and create unforgettable memories with our curated travel experiences.',
        sociallink: '#',
        email: 'hello@tourapp.com',
        phone: '+1 (555) 123-4567'
      }
    });
  }
}
