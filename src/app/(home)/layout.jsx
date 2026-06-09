import Navbar from '@/components/ui/Navbar';

export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col pt-[72px]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 mt-auto py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">TourApp</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} All rights reserved. Powered by Tour SaaS.
          </p>
        </div>
      </footer>
    </div>
  );
}
