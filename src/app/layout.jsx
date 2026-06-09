import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { AppProvider } from '@/components/helper/Context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tour Booking App',
  description: 'Book your next adventure with us',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
