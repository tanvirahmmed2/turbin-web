import CustomerSidebar from '@/components/ui/CustomerSidebar';

export default function CustomerPanelLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#050505]">
      <CustomerSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
