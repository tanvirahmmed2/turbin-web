import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { AppProvider } from '@/components/helper/Context';

const inter = Inter({ subsets: ['latin'] });

import { getTenantId, getTenantStatus } from '@/lib/tenant';
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

export default async function RootLayout({ children }) {
  const { tenant_status, subscription_status } = await getTenantStatus();

  if (tenant_status === 'not_found') {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased min-h-screen flex items-center justify-center p-4`}>
          <div className="bg-white max-w-md w-full rounded-3xl p-10 text-center shadow-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No Website Found</h1>
            <p className="text-gray-500 mb-6">
              We couldn't find a website associated with this domain.
            </p>
            <div className="text-sm text-gray-400">
              Please check the URL or contact support.
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (tenant_status !== 'active' || (subscription_status !== 'active' && subscription_status !== 'trial')) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased min-h-screen flex items-center justify-center p-4`}>
          <div className="bg-white max-w-md w-full rounded-3xl p-10 text-center shadow-2xl border border-gray-100">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Unavailable</h1>
            <p className="text-gray-500 mb-6">
              {tenant_status !== 'active'
                ? `This website is currently ${tenant_status}.`
                : `This website's subscription is ${subscription_status}.`}
            </p>
            <div className="text-sm text-gray-400">
              Please contact support or the website administrator to restore access.
            </div>
          </div>
        </body>
      </html>
    );
  }

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
