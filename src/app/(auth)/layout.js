import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-10 bg-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(99,102,241,0.1)_0%,transparent_60%)] pointer-events-none z-0" />
      <div className="relative z-10 w-full max-w-[440px] bg-gradient-card border border-border rounded-3xl p-16 backdrop-blur-md shadow-lg">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-text no-underline">
            <span className="bg-gradient-primary text-transparent bg-clip-text">✦</span> Tourera
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
