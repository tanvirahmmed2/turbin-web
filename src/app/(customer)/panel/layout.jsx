import CustomerSidebar from '@/components/ui/CustomerSidebar';
import { requireRole } from '@/lib/auth';

export default async function CustomerPanelLayout({ children }) {
  await requireRole();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <CustomerSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
