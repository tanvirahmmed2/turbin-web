'use client';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/components/helper/Context';
import Image from 'next/image';

export default function Sidebar({ session }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { website } = useAppContext();

  const isOpen = searchParams.get('menu') === 'open';

  const onClose = () => {
    router.push(pathname);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tours', href: '/tours' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center p-4 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      >
        {/* Popup Menu */}
        <div 
          className={`w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 flex flex-col max-h-[90vh] ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
          onClick={(e) => e.stopPropagation()}
        >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3" onClick={onClose}>
            {website?.logo_url && (
              <Image width={100} height={100} src={website.logo_url} alt={website?.hero_title} className="h-8 rounded-md" />
            )}
            <span className="self-center text-2xl font-extrabold whitespace-nowrap text-gray-900">
              {website?.hero_title || 'TourApp'}
            </span>
          </Link>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <ul className="p-4 space-y-2 flex-1 mt-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={isActive ? { backgroundColor: website?.theme_color ? `${website.theme_color}20` : '#eff6ff', color: website?.theme_color || '#3b82f6' } : {}}
                  className={`block py-3 px-4 rounded-xl transition-colors font-medium text-base ${isActive ? '' : 'text-gray-700 hover:bg-gray-50'}`}
                  onClick={onClose}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User section */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50">
           {session ? (
              <div className="space-y-3">
                 <div className="mb-4 px-2">
                   <span className="block text-base font-bold text-gray-900 truncate">{session.name || session.email || 'User'}</span>
                   <span className="block text-sm text-gray-500 truncate capitalize font-medium">{session.role} account</span>
                 </div>
                 <Link href="/panel" onClick={onClose} className="block w-full py-3 px-4 text-center rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm">
                   Customer Panel
                 </Link>
                 {session.role !== 'customer' && (
                   <Link href="/dashboard" onClick={onClose} className="block w-full py-3 px-4 text-center rounded-xl bg-gray-900 border border-gray-900 text-sm font-semibold text-white hover:bg-gray-800 transition-colors shadow-sm">
                     Dashboard
                   </Link>
                 )}
                 <button
                   onClick={async () => {
                     try {
                       await fetch('/api/user/logout', { method: 'POST' });
                       window.location.href = '/login';
                     } catch (err) {
                       console.error('Logout failed', err);
                     }
                   }}
                   className="block w-full py-3 px-4 text-center rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors mt-2"
                 >
                   Sign out
                 </button>
              </div>
           ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  href="/login"
                  className="w-full text-center text-gray-700 font-semibold rounded-xl text-sm px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                  onClick={onClose}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  style={{ backgroundColor: website?.theme_color || '#3b82f6' }}
                  className="w-full text-center text-white font-semibold rounded-xl text-sm px-4 py-3 transition-colors shadow-sm hover:opacity-90"
                  onClick={onClose}
                >
                  Sign up
                </Link>
              </div>
           )}
        </div>
        </div>
      </div>
    </>
  );
}
