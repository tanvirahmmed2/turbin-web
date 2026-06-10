import DashboardSidebar from '@/components/ui/DashboardSidebar';
import { requireRole } from '@/lib/auth';

export default async function DashboardLayout({ children }) {
  await requireRole(['owner', 'manager', 'staff', 'guide', 'support']);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <DashboardSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
