import Link from 'next/link';

const LINKS = {
  Product: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'Solutions' },
    { href: '/blog', label: 'Blog' },
  ],
  Company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/blog', label: 'Updates' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/cookies', label: 'Cookie Policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50 pt-24 pb-12 relative overflow-hidden w-full px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(79,70,229,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6 max-w-sm">
            <Link href="/" className="flex items-center gap-2.5 no-underline group">
              <span className="font-extrabold text-xl tracking-tight text-text">Tourera</span>
            </Link>
            <p className="text-sm text-text-2 leading-relaxed">
              The all-in-one platform for modern tour companies. Manage bookings, staff, and payments from one powerful dashboard.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-semibold text-text-2 hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">𝕏</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-sm font-semibold text-text-2 hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">in</a>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-x-16 gap-y-10">
            {Object.entries(LINKS).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-5 min-w-[140px]">
                <h4 className="text-xs font-bold text-text-3 uppercase tracking-wider">{group}</h4>
                <ul className="flex flex-col gap-3.5 list-none p-0 m-0">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group relative text-sm font-semibold text-text-2 hover:text-primary inline-block transition-all duration-300">
                        {l.label}
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-200/80">
          <p className="text-subtle text-xs">
            © {new Date().getFullYear()} Tourera. All rights reserved.
          </p>
          <p className="text-subtle text-xs">
            Built with ❤️ for tour operators worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
