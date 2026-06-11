import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }) {
  const session = await getServerSession();
  
  if (session) {
    if (session.role === 'customer') {
      redirect('/panel');
    } else {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
