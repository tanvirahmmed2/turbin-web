import Hero from '@/components/pages/Hero';
import UpcomingTours from '@/components/pages/UpcomingTours';
import Features from '@/components/pages/Features';
import Stats from '@/components/pages/Stats';
import CallToAction from '@/components/pages/CallToAction';
import ReviewsSlider from '@/components/ReviewsSlider';

export const revalidate = 60; // Revalidate page every 60 seconds

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Hero />
      <Features />
      <UpcomingTours />
      <Stats />
      <ReviewsSlider />
      <CallToAction />
    </main>
  );
}
