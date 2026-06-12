'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { useAppContext } from '@/components/helper/Context';

export default function TourDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { website } = useAppContext();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [session, setSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [seats, setSeats] = useState(1);
  const [phone, setPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [separateRoom, setSeparateRoom] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    axios.get('/api/user').then(res => setSession(res.data.user)).catch(() => {});
  }, []);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`/api/tours/${slug}`);
        setTour(response.data.tour);
      } catch (err) {
        console.error('Error fetching tour:', err);
        setError('Failed to load tour details.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchTour();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin bg-white"></div>
      </main>
    );
  }

  if (error || !tour) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Tour not found</h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </main>
    );
  }

  const handleBookClick = (scheduleId = '') => {
    if (!session) {
      alert('Please login as a customer to book a tour.');
      return;
    }
    if (scheduleId) setSelectedSchedule(scheduleId);
    else if (tour.schedules?.length > 0) setSelectedSchedule(tour.schedules[0].schedule_id);
    
    setIsModalOpen(true);
    setTimeout(() => {
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const calculateTotal = () => {
    if (!tour) return 0;
    let total = Number(tour.base_price) * seats;
    if (separateRoom && tour.separate_room_available && seats >= 2) {
      total += Number(tour.separate_room_charge);
    }
    return total;
  };

  const maxAvailableSeats = tour?.schedules?.find(s => String(s.schedule_id) === String(selectedSchedule))?.available_seats || 1;

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    
    if (phone.length !== 11) {
      setBookingError('Phone number must be exactly 11 digits.');
      return;
    }

    setBookingLoading(true);
    try {
      await axios.post('/api/customer/bookings', {
        tour_id: tour.tour_id,
        schedule_id: selectedSchedule,
        seats,
        phone,
        transaction_id: transactionId,
        separate_room: separateRoom
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-24 pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                <span>{tour.starting_location}</span>
                {tour.finish_location && tour.finish_location !== tour.starting_location && (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    <span>{tour.finish_location}</span>
                  </>
                )}
              </div>
              {tour.duration && (
                <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-semibold">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>{tour.duration}</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
              {tour.title}
            </h1>
            <div 
              className="prose prose-lg text-gray-600 max-w-none"
              dangerouslySetInnerHTML={{ __html: tour.description }}
            />
            <div className="flex items-center space-x-6 pt-4">
              <div>
                <span className="block text-sm text-gray-500">Starting from</span>
                <span className="text-3xl font-bold text-gray-900">
                  ${tour.base_price}
                </span>
                {tour.separate_room_available && (
                  <div className="mt-2 text-sm font-medium text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded-md border border-blue-100">
                    + ${tour.separate_room_charge} for Separate Room
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleBookClick()}
                className="px-8 py-4 rounded-xl text-white font-semibold transition-transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: website?.theme_color || '#3b82f6', boxShadow: `0 10px 15px -3px ${website?.theme_color}40` }}
              >
                Book Now
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-gray-200 shadow-xl relative bg-white flex snap-x snap-mandatory overflow-x-auto hide-scrollbar">
              {tour.spots && tour.spots.length > 0 ? (
                tour.spots.map((spot, i) => (
                  <div key={spot.spot_id || i} className="min-w-full h-full snap-center relative">
                    <img 
                      src={spot.image || `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800&random=${tour.tour_id + i}`} 
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow">
                      {spot.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="min-w-full h-full snap-center relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=800&random=${tour.tour_id}`} 
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            {/* Spot Names Badges */}
            {tour.spots && tour.spots.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center pt-2">
                <span className="text-sm font-semibold text-gray-500">Visiting Spots:</span>
                {tour.spots.map(spot => (
                  <Link href={`/spots/${spot.spot_id}`} key={spot.spot_id} className="px-3 py-1 bg-gray-100 text-gray-700 hover:text-blue-600 hover:bg-blue-50 text-sm rounded-full font-medium border border-gray-200 transition-colors">
                    {spot.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Features */}
            {tour.features?.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Tour Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tour.features.map(feature => (
                    <div key={feature.feature_id} className="flex items-center space-x-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="font-medium">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Schedules */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Schedules</h2>
            
            {tour.schedules?.length > 0 ? (
              <div className="space-y-4">
                {tour.schedules.map(schedule => {
                  const date = new Date(schedule.tour_date);
                  return (
                    <div key={schedule.schedule_id} className="p-5 bg-white rounded-2xl border border-gray-200 flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-md font-medium ${schedule.available_seats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {schedule.available_seats} seats left
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl border border-gray-200 text-center bg-white">
                <p className="text-gray-500">No upcoming schedules available.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Booking Form Section */}
      {isModalOpen && (
        <div id="booking-section" className="mt-16 bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden relative max-w-3xl mx-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Book Your Tour</h3>
              <button 
                onClick={() => { setIsModalOpen(false); setBookingSuccess(false); }}
                className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Booking Submitted!</h4>
                  <p className="text-gray-600 mb-6">Your booking is currently pending. You can view it in your customer portal.</p>
                  <Link href="/panel" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium inline-block">Go to Portal</Link>
                </div>
              ) : (
                <form onSubmit={submitBooking} className="space-y-5">
                  {bookingError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{bookingError}</div>}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Schedule</label>
                    <select 
                      required
                      value={selectedSchedule}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" disabled>Select a date...</option>
                      {tour.schedules?.map(s => (
                        <option key={s.schedule_id} value={s.schedule_id} disabled={s.available_seats === 0}>
                          {new Date(s.tour_date).toLocaleDateString()} ({s.available_seats} seats left)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seats Required</label>
                      <input 
                        type="number" min="1" max={maxAvailableSeats} required
                        value={seats} onChange={(e) => {
                          const val = Math.min(Math.max(1, Number(e.target.value)), maxAvailableSeats);
                          setSeats(val);
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                      <input 
                        type="tel" required placeholder="01XXXXXXXXX"
                        pattern="\d{11}" title="Phone number must be exactly 11 digits"
                        maxLength="11"
                        value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {tour.separate_room_available && seats >= 2 && (
                    <div className="flex items-center space-x-3 p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
                      <input 
                        type="checkbox" id="sepRoom"
                        checked={separateRoom} onChange={(e) => setSeparateRoom(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300"
                      />
                      <label htmlFor="sepRoom" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Add separate room (+${tour.separate_room_charge})
                      </label>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (Payment Reference)</label>
                    <input 
                      type="text" required placeholder="TXN-..."
                      value={transactionId} onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">Total Amount</div>
                      <div className="text-3xl font-bold text-gray-900">${calculateTotal()}</div>
                    </div>
                    <button 
                      type="submit" disabled={bookingLoading}
                      className="px-8 py-3 rounded-xl text-white font-bold transition-all disabled:opacity-50"
                      style={{ backgroundColor: website?.theme_color || '#3b82f6' }}
                    >
                      {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              )}
            </div>
        </div>
      )}
    </main>
  );
}
