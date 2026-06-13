'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/components/helper/Context';
import Image from 'next/image';

export default function Navbar({ session }) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { website } = useAppContext();
  const brandName = website?.hero_title || 'TourApp';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="fixed w-full z-50 top-0 inset-s-0 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between  p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          {website?.logo_url && (
            <Image width={100} height={100} src={website.logo_url} alt={brandName} className="h-8 rounded-md" />
          )}
          <span className="self-center text-2xl font-bold whitespace-nowrap text-gray-900">
            {brandName}
          </span>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative" ref={dropdownRef}>
          {session ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex text-sm rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 :ring-gray-600"
                type="button"
              >
                <span className="sr-only">Open user menu</span>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-10 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 truncate">{session.name || session.email || 'User'}</span>
                    <span className="block text-sm text-gray-500 truncate capitalize">{session.role}</span>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <Link href="/panel" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 :text-white">
                        Customer Panel
                      </Link>
                    </li>
                    {session.role !== 'customer' && (
                      <li>
                        <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 :text-white">
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={async () => {
                          try {
                            await fetch('/api/user/logout', { method: 'POST' });
                            window.location.href = '/login';
                          } catch (err) {
                            console.error('Logout failed', err);
                          }
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 :text-red-500"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden md:block text-gray-900 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors mr-2"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden md:block text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors"
              >
                Sign up
              </Link>
            </>
          )}

          {/* Toggle Menu Button */}
          <Link 
            href={`${pathname}?menu=open`}
            className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-7 h-7" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </Link>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent md: bg-white">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block py-2 px-3 rounded md:p-0 transition-colors ${pathname === link.href ? 'text-blue-600 ' : 'text-gray-900 hover:text-blue-600 md::text-blue-500'}`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
