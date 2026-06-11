'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function TourForm({ initialData = null, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    location: initialData?.location || '',
    base_price: initialData?.base_price || '',
    status: initialData?.status || 'active',
  });

  const [spots, setSpots] = useState(initialData?.spots || []);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpotChange = (index, e) => {
    const { name, value } = e.target;
    const newSpots = [...spots];
    newSpots[index][name] = value;
    setSpots(newSpots);
  };

  const addSpot = () => {
    setSpots([...spots, { name: '', description: '', location: '', image: '', image_id: '' }]);
  };

  const removeSpot = (index) => {
    const newSpots = [...spots];
    newSpots.splice(index, 1);
    setSpots(newSpots);
  };

  const handleImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await axios.post('/api/admin/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newSpots = [...spots];
      newSpots[index].image = res.data.image_url;
      newSpots[index].image_id = res.data.image_id;
      setSpots(newSpots);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload failed', error);
      toast.error(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, spots });
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
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Base Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
              placeholder="e.g. Zurich, Switzerland"
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Tour Spots</h2>
          <button
            type="button"
            onClick={addSpot}
            className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium transition-colors border border-gray-200"
          >
            + Add Spot
          </button>
        </div>

        {spots.length === 0 ? (
          <p className="text-gray-500 text-center py-6">No spots added yet. Click above to add destinations to this tour.</p>
        ) : (
          <div className="space-y-6">
            {spots.map((spot, index) => (
              <div key={index} className="p-6 rounded-2xl border border-gray-200 relative bg-white">
                <button
                  type="button"
                  onClick={() => removeSpot(index)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-400 text-sm font-medium"
                >
                  Remove
                </button>
                <h3 className="text-gray-900 font-medium mb-4">Spot {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Spot Name</label>
                    <input
                      type="text"
                      name="name"
                      value={spot.name}
                      onChange={(e) => handleSpotChange(index, e)}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={spot.location || ''}
                      onChange={(e) => handleSpotChange(index, e)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-blue-500 bg-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <RichTextEditor
                      value={spot.description || ''}
                      onChange={(value) => handleSpotChange(index, { target: { name: 'description', value } })}
                      placeholder="Describe this spot..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Image</label>
                    <div className="flex items-center space-x-4">
                      {spot.image && (
                        <img src={spot.image} alt="Spot" className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-white" />
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(index, e)}
                          disabled={uploadingImage}
                          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-900 hover:file:bg-gray-200 disabled:opacity-50"
                        />
                        {uploadingImage && <p className="text-xs text-blue-400 mt-2">Uploading image...</p>}
                      </div>
                    </div>
                  </div>
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
          disabled={loading || uploadingImage}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Tour' : 'Create Tour'}
        </button>
      </div>
    </form>
  );
}
