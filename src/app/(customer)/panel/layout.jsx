import { Suspense } from 'react';
import CustomerSidebar from '@/components/ui/CustomerSidebar';
import { requireRole } from '@/lib/auth';
import Link from 'next/link';

export default async function CustomerPanelLayout({ children }) {
  await requireRole();

  return (
    <div className="flex min-h-screen text-gray-900 bg-gray-50/50">
      <Suspense fallback={<div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 hidden md:block" />}>
        <CustomerSidebar />
      </Suspense>
      <main className="flex-1 overflow-x-hidden flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 p-4 sticky top-0 z-30">
          <span className="font-bold text-gray-900 text-lg">Customer Portal</span>
          <Link href="?sidebar=open" className="p-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
            <span className="sr-only">Open sidebar</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto p-4 md:p-8 w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
