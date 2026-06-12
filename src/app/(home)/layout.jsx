import { Suspense } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Sidebar from '@/components/ui/Sidebar';
import { getServerSession } from '@/lib/auth';

export default async function HomeLayout({ children }) {
  const session = await getServerSession();

  return (
    <div className="min-h-screen flex flex-col pt-14">
      <Navbar session={session} />
      <Suspense fallback={null}>
        <Sidebar session={session} />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
