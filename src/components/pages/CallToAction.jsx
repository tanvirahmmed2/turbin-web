import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="relative rounded-3xl overflow-hidden bg-gray-900 px-6 py-20 text-center shadow-2xl sm:px-16 border border-gray-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-gray-300 mb-10">Join thousands of travelers who have explored the world with our expert-guided tours. Book your next journey today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/tours" 
              className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              Explore All Tours
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
