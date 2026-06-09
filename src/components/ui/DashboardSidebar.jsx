'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { useAppContext } from '@/components/helper/Context';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { website } = useAppContext();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/user');
        setRole(res.data.user?.role);
      } catch (err) {
        console.error('Failed to get user role', err);
      }
    };
    fetchUser();
  }, []);

  const getLinks = () => {
    const baseLinks = [];
    if (role === 'owner') {
      baseLinks.push(
        { href: '/dashboard/owner', label: 'Owner Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { href: '/dashboard/owner/analytics', label: 'Analytics', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
        { href: '/dashboard/owner/website', label: 'Website Settings', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' }
      );
    }
    
    if (['owner', 'manager'].includes(role)) {
      baseLinks.push(
        { href: '/dashboard/manager', label: 'Operations', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { href: '/dashboard/manager/tours', label: 'Manage Tours', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { href: '/dashboard/manager/bookings', label: 'All Bookings', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { href: '/dashboard/manager/customers', label: 'Customers', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
      );
    }

    if (['owner', 'manager', 'support'].includes(role)) {
      baseLinks.push(
        { href: '/dashboard/support/supports', label: 'Support Inbox', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' }
      );
    }

    if (!role) {
      baseLinks.push({ href: '#', label: 'Loading...', icon: 'M4 4h16v16H4z' });
    }

    return baseLinks;
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-[#111] text-gray-300 border-r border-[#222] h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-[#222]">
        <Link href="/" className="text-2xl font-black tracking-tight" style={{ color: website?.theme_color || '#3b82f6' }}>
          {website?.name || 'TourBooking'}
        </Link>
        <div className="mt-1 text-xs text-gray-500 font-medium uppercase tracking-wider">Admin Dashboard</div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link, idx) => {
          const isActive = pathname.startsWith(link.href) && link.href !== '#';
          return (
            <Link
              key={idx}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-[#222] text-white font-semibold' 
                  : 'hover:bg-[#1a1a1a] hover:text-white'
              }`}
              style={isActive ? { borderLeft: `3px solid ${website?.theme_color || '#3b82f6'}` } : { borderLeft: '3px solid transparent' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? "2.5" : "2"} d={link.icon} />
              </svg>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#222]">
        <div className="flex items-center space-x-3 px-4 py-3 bg-[#1a1a1a] rounded-xl">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase">
            {role ? role.substring(0, 2) : '??'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white capitalize">{role || 'Loading'}</p>
            <p className="text-xs text-gray-500">Logged In</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
