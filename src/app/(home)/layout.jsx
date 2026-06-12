import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Sidebar from '@/components/ui/Sidebar';
import { getServerSession } from '@/lib/auth';

export default async function HomeLayout({ children }) {
  const session = await getServerSession();

  return (
    <div className="min-h-screen flex flex-col pt-[72px]">
      <Navbar session={session} />
      <Sidebar session={session} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
