import Link from 'next/link';
import { query } from '@/lib/db';


// Fetch basic tenant details
async function getTenantDetails(slug) {
  try {
    const res = await query(`SELECT name, contact_email, phone FROM ts_tenants WHERE slug = $1`, [slug]);
    return res.rows[0] || null;
  } catch (e) {
    return null;
  }
}

export default async function TenantLayout({ children, params }) {
  const { slug } = await params; // Next 16 requires await for params
  const tenant = await getTenantDetails(slug) || { name: slug.toUpperCase() };

  return (
    <div className={"min-h-screen flex flex-col bg-bg text-text"}>
      <header className="flex items-center justify-between py-4 px-8 bg-surface border-b border-border">
        <Link href="/" className="text-2xl font-extrabold no-underline text-text">
          {tenant.name}
        </Link>
        <nav className={"flex items-center gap-2"}>
          <Link href={`/t/${slug}`} className={"flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] text-[0.9rem] text-text-2 transition-all duration-200 no-underline hover:bg-[#8b5cf6]/10 hover:text-[#c4b5fd]"}>Home</Link>
          <Link href={`/t/${slug}/tours`} className={"flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] text-[0.9rem] text-text-2 transition-all duration-200 no-underline hover:bg-[#8b5cf6]/10 hover:text-[#c4b5fd]"}>Tours</Link>
          <Link href={`/t/${slug}/contact`} className={"flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] text-[0.9rem] text-text-2 transition-all duration-200 no-underline hover:bg-[#8b5cf6]/10 hover:text-[#c4b5fd]"}>Contact</Link>
          <Link href={`/t/${slug}/support`} className={"flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] text-[0.9rem] text-text-2 transition-all duration-200 no-underline hover:bg-[#8b5cf6]/10 hover:text-[#c4b5fd]"}>Support</Link>
        </nav>
      </header>
      
      <main className={"flex-1 flex flex-col overflow-hidden"}>
        {children}
      </main>

      <footer className="mt-auto border-t border-border bg-white/5 py-8 text-center text-sm text-text-2">
        <div className="mb-4">
          <div className="font-bold">{tenant.name}</div>
          {tenant.contact_email && <div className="mt-2">Email: {tenant.contact_email}</div>}
        </div>
        <div className="flex justify-center gap-4">
          <Link href={`/t/${slug}/support`} className="hover:text-primary transition">Support</Link>
        </div>
        <div className="mt-6 opacity-50">Powered by Tourera</div>
      </footer>
    </div>
  );
}
