import Hero from '@/components/pages/Hero';
import UpcomingTours from '@/components/pages/UpcomingTours';

export const revalidate = 60; // Revalidate page every 60 seconds

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white dark:bg-[#0a0a0a]">
      <Hero />
      <UpcomingTours />
    </main>
  );
}
