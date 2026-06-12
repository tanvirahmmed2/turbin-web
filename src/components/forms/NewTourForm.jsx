'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function TourForm({ initialData = null, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
    starting_location: initialData?.starting_location || '',
    finish_location: initialData?.finish_location || '',
    base_price: initialData?.base_price || '',
    seat: initialData?.seat || '',
    separate_room_available: initialData?.separate_room_available || false,
    separate_room_charge: initialData?.separate_room_charge || '',
    status: initialData?.status || 'active',
  });

  const [spots, setSpots] = useState(initialData?.spots || []);
  const [features, setFeatures] = useState(initialData?.features || []);
  const [schedules, setSchedules] = useState(initialData?.schedules?.map(s => ({
    ...s,
    tour_date: s.tour_date ? new Date(s.tour_date).toISOString().split('T')[0] : '',
    last_registration_date: s.last_registration_date ? new Date(s.last_registration_date).toISOString().slice(0, 16) : ''
  })) || []);
  const [availableSpots, setAvailableSpots] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);

  const fetchData = async () => {
    try {
      const [spotsRes, featuresRes] = await Promise.all([
        axios.get('/api/admin/spots'),
        axios.get('/api/admin/features')
      ]);
      setAvailableSpots(spotsRes.data.spots || []);
      setAvailableFeatures(featuresRes.data.features || []);
    } catch (err) {
      console.error('Failed to load initial data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSpotSelect = (e) => {
    const spotId = e.target.value;
    if (!spotId) return;
    
    const spotToAdd = availableSpots.find((s) => s.spot_id == spotId);
    if (spotToAdd && !spots.find((s) => s.spot_id == spotId)) {
      setSpots([...spots, spotToAdd]);
    }
    // reset select
    e.target.value = "";
  };

  const removeSpot = (index) => {
    const newSpots = [...spots];
    newSpots.splice(index, 1);
    setSpots(newSpots);
  };

  const handleFeatureSelect = (e) => {
    const featureId = e.target.value;
    if (!featureId) return;
    
    const featureToAdd = availableFeatures.find((f) => f.feature_id == featureId);
    if (featureToAdd && !features.find((f) => f.feature_id == featureId)) {
      setFeatures([...features, featureToAdd]);
    }
    e.target.value = "";
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    setFeatures(updatedFeatures);
  };

  const addSchedule = () => {
    setSchedules([...schedules, { tour_date: '', start_time: '', end_time: '', last_registration_date: '', max_seats: '' }]);
  };

  const removeSchedule = (index) => {
    const updated = [...schedules];
    updated.splice(index, 1);
    setSchedules(updated);
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, spots, features, schedules });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="p-8 rounded-3xl border border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Tour Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Tour Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
              placeholder="e.g. 5-Day Alpine Adventure"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              placeholder="Describe the tour..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
              placeholder="e.g. 3 Days 2 Nights"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Starting Location</label>
            <input
              type="text"
              name="starting_location"
              value={formData.starting_location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
              placeholder="e.g. Zurich, Switzerland"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Finish Location</label>
            <input
              type="text"
              name="finish_location"
              value={formData.finish_location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
              placeholder="e.g. Geneva, Switzerland"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Base Price ($)</label>
            <input
              type="number"
              name="base_price"
              value={formData.base_price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
              placeholder="e.g. 499.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Number of Seats</label>
            <input
              type="number"
              name="seat"
              value={formData.seat}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
              placeholder="e.g. 15"
            />
          </div>
          {initialData && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 rounded-3xl border border-gray-200 bg-white">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Upgrades & Add-ons</h2>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="separate_room_available"
              name="separate_room_available"
              checked={formData.separate_room_available}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="separate_room_available" className="text-sm font-medium text-gray-700">
              Offer Separate Room Upgrade
            </label>
          </div>
          
          {formData.separate_room_available && (
            <div className="pl-8 transition-all">
              <label className="block text-sm font-medium text-gray-600 mb-2">Additional Charge for Separate Room ($)</label>
              <input
                type="number"
                name="separate_room_charge"
                value={formData.separate_room_charge}
                onChange={handleChange}
                required={formData.separate_room_available}
                min="0"
                step="0.01"
                className="w-full max-w-xs px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
                placeholder="e.g. 150.00"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8 rounded-3xl border border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tour Spots</h2>
          <select
            onChange={handleSpotSelect}
            className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium transition-colors border border-gray-200 focus:outline-none focus:border-blue-500"
            defaultValue=""
          >
            <option value="" disabled>+ Add Spot</option>
            {availableSpots.map((spot) => (
              <option key={spot.spot_id} value={spot.spot_id} disabled={spots.some(s => s.spot_id === spot.spot_id)}>
                {spot.name} {spots.some(s => s.spot_id === spot.spot_id) ? '(Added)' : ''}
              </option>
            ))}
          </select>
        </div>

        {spots.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No spots added yet. Select a spot from the dropdown above to add it to this tour.</p>
        ) : (
          <div className="space-y-4">
            {spots.map((spot, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center space-x-4">
                  {spot.image ? (
                    <img src={spot.image} alt={spot.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs">No Img</div>
                  )}
                  <div>
                    <h3 className="text-gray-900 font-medium">{spot.name}</h3>
                    <p className="text-sm text-gray-500">{spot.location}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeSpot(index)}
                  className="text-red-500 hover:text-red-400 text-sm font-medium px-3 py-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-8 rounded-3xl border border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tour Features</h2>
          <select
            onChange={handleFeatureSelect}
            className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium transition-colors border border-gray-200 focus:outline-none focus:border-blue-500"
            defaultValue=""
          >
            <option value="" disabled>+ Add Feature</option>
            {availableFeatures.map((feature) => (
              <option key={feature.feature_id} value={feature.feature_id} disabled={features.some(f => f.feature_id === feature.feature_id)}>
                {feature.name} {features.some(f => f.feature_id === feature.feature_id) ? '(Added)' : ''}
              </option>
            ))}
          </select>
        </div>

        {features.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No features added yet. Select a feature from the dropdown above to add it to this tour.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                <span className="font-medium text-sm">{feature.name}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-blue-400 hover:text-blue-600 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-8 rounded-3xl border border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tour Schedules</h2>
          <button
            type="button"
            onClick={addSchedule}
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            + Add Schedule
          </button>
        </div>

        {schedules.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No schedules added yet.</p>
        ) : (
          <div className="space-y-6">
            {schedules.map((schedule, index) => (
              <div key={index} className="p-4 rounded-2xl border border-gray-200 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-4 relative pt-10 md:pt-4">
                <button
                  type="button"
                  onClick={() => removeSchedule(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-600 font-medium text-sm z-10"
                >
                  Remove
                </button>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tour Date *</label>
                  <input
                    type="date"
                    required
                    value={schedule.tour_date || ''}
                    onChange={(e) => handleScheduleChange(index, 'tour_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Registration Deadline *</label>
                  <input
                    type="datetime-local"
                    required
                    value={schedule.last_registration_date || ''}
                    onChange={(e) => handleScheduleChange(index, 'last_registration_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={schedule.start_time || ''}
                    onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">End Time</label>
                  <input
                    type="time"
                    value={schedule.end_time || ''}
                    onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Max Seats *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={schedule.max_seats || ''}
                    onChange={(e) => handleScheduleChange(index, 'max_seats', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-transparent border border-gray-600 text-gray-900 font-medium rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Tour' : 'Create Tour'}
        </button>
      </div>
    </form>
  );
}
