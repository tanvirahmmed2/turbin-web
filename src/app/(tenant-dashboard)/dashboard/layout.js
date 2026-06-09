import Link from 'next/link';
import { getSession } from '@/lib/auth';
import LogoutButton from '@/components/dashboard/LogoutButton';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/tours', label: 'Tours', icon: '🗺️' },
  { href: '/dashboard/schedules', label: 'Schedules', icon: '📅' },
  { href: '/dashboard/bookings', label: 'Bookings', icon: '📝' },
  { href: '/dashboard/customers', label: 'Customers', icon: '👥' },
  { href: '/dashboard/payments', label: 'Payments', icon: '💳' },
  { href: '/dashboard/staff', label: 'Staff', icon: '👨‍💼' },
  { href: '/dashboard/support', label: 'Support', icon: '🎫' },
  { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  { href: '/dashboard/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/dashboard/settings/profile', label: 'Settings', icon: '⚙️' },
];

export default async function TenantDashboardLayout({ children }) {
  const session = await getSession();
  
  return (
    <div className="flex h-screen bg-bg text-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] bg-bg-2 border-r border-slate-200/80 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-200/80 bg-gradient-to-br from-primary/[0.02] to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-primary text-sm font-black">✦</span>
            <span className="text-sm font-extrabold text-text tracking-tight uppercase">Company Portal</span>
          </div>
          <div className="text-[10px] font-bold text-text-3 tracking-wider uppercase">Operations Deck</div>
        </div>
        
        <nav className="p-4 flex flex-col gap-1.5 flex-1 overflow-y-auto">
          <div className="text-[10px] uppercase tracking-wider text-text-3 font-bold mb-2 pl-3">Main Menu</div>
          {NAV_LINKS.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="flex items-center gap-3.5 py-2.5 px-3.5 rounded-xl text-[13px] font-semibold text-text-2 transition-all duration-250 no-underline hover:bg-black/[0.025] hover:text-text"
            >
              <span className="text-lg filter drop-shadow-[0_2px_4px_rgba(99,102,241,0.08)] shrink-0">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200/80 bg-gradient-to-t from-primary/[0.01] to-transparent">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-bg">
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-end px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center font-extrabold text-white text-sm shadow-sm">
              {session?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-text font-bold text-xs">{session?.name || 'User'}</span>
              <span className="text-text-3 text-[10px] tracking-wider uppercase font-semibold">{session?.role || 'operator'}</span>
            </div>
          </div>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
