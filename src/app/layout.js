import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['400','500','600','700','800'] });

export const metadata = {
  title: { default: 'Tourera — Tour Management SaaS', template: '%s | Tourera' },
  description: 'The all-in-one platform for modern tour companies. Manage bookings, staff, payments, and analytics from one powerful dashboard.',
  keywords: ['tour management', 'booking software', 'travel agency', 'SaaS'],
  openGraph: {
    title: 'Tourera — Tour Management SaaS',
    description: 'Manage your entire tour business from one dashboard.',
    type: 'website',
  },
};

import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable} overflow-x-hidden `}>
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
