import Image from 'next/image';
import Link from 'next/link';

export default function Tour({ tour }) {
  return (
    <div className="group relative flex flex-col justify-between bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="aspect-[4/3] overflow-hidden relative">
        {/* Placeholder for Tour Image. We could add tour.image_url later */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <img 
          src={tour.spots?.[0]?.image || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800&random=${tour.tour_id}`} 
          alt={tour.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        
        <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-gray-900 border border-gray-200">
          ${tour.base_price}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span className="truncate">
            {tour.starting_location} 
            {tour.finish_location && tour.finish_location !== tour.starting_location && ` → ${tour.finish_location}`}
          </span>
        </div>

        {tour.duration && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span className="truncate">{tour.duration}</span>
          </div>
        )}

        {tour.spots && tour.spots.length > 0 && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg className="w-4 h-4 mr-1 flex-shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
            <span className="truncate font-medium text-gray-700">{tour.spots.map(s => s.name).join(', ')}</span>
          </div>
        )}
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {tour.title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
          {tour.description?.replace(/<[^>]*>?/gm, '') || ''}
        </p>
        
        <Link 
          href={`/tours/${tour.slug}`}
          className="w-full text-center py-3 rounded-xl border border-gray-200 text-gray-900 font-medium transition-colors bg-white"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
