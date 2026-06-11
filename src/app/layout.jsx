import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { AppProvider } from '@/components/helper/Context';

const inter = Inter({ subsets: ['latin'] });

import { getTenantId } from '@/lib/tenant';
import { dbQuery } from '@/lib/db';

export async function generateMetadata() {
  try {
    const tenantId = await getTenantId();
    const result = await dbQuery(
      'SELECT hero_title, hero_subtitle, tagline FROM tour_websites WHERE tenant_id = $1',
      [tenantId]
    );

    if (result.rows.length > 0) {
      const site = result.rows[0];
      return {
        title: site.hero_title || 'Tour Booking App',
        description: site.tagline || site.hero_subtitle || 'Book your next adventure with us',
      };
    }
  } catch (error) {
    console.error('Metadata fetch error', error);
  }

  return {
    title: 'Tour Booking App',
    description: 'Book your next adventure with us',
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
