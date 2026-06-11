import DashboardSidebar from '@/components/ui/DashboardSidebar';
import { requireRole } from '@/lib/auth';

export default async function DashboardLayout({ children }) {
  await requireRole(['owner', 'manager', 'staff', 'guide', 'support']);

  return (
    <div className="flex min-h-screen text-gray-900">
      <DashboardSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
