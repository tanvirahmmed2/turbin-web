import DashboardSidebar from '@/components/ui/DashboardSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <DashboardSidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
