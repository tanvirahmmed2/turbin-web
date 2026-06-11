'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function ManageSpots() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpot, setEditingSpot] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    image: '',
    image_id: ''
  });

  const fetchSpots = async () => {
    try {
      const res = await axios.get('/api/admin/spots');
      setSpots(res.data.spots || []);
    } catch (err) {
      console.error('Failed to load spots', err);
      toast.error('Failed to load spots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const openCreateModal = () => {
    setEditingSpot(null);
    setFormData({ name: '', description: '', location: '', image: '', image_id: '' });
    setModalOpen(true);
  };

  const openEditModal = (spot) => {
    setEditingSpot(spot);
    setFormData({
      name: spot.name,
      description: spot.description || '',
      location: spot.location || '',
      image: spot.image || '',
      image_id: spot.image_id || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingSpot(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploadingImage(true);
    try {
      const res = await axios.post('/api/admin/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({
        ...prev,
        image: res.data.image_url,
        image_id: res.data.image_id
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload failed', error);
      toast.error(error.response?.data?.error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSpot) {
        await axios.put(`/api/admin/spots/${editingSpot.spot_id}`, formData);
        toast.success('Spot updated successfully');
      } else {
        await axios.post('/api/admin/spots', formData);
        toast.success('Spot created successfully');
      }
      closeModal();
      fetchSpots();
    } catch (error) {
      console.error('Error saving spot', error);
      toast.error('Failed to save spot');
    }
  };

  const handleDelete = async (spotId) => {
    if (confirm('Are you sure you want to delete this spot?')) {
      try {
        await axios.delete(`/api/admin/spots/${spotId}`);
        toast.success('Spot deleted successfully');
        fetchSpots();
      } catch (error) {
        console.error('Error deleting spot', error);
        toast.error('Failed to delete spot');
      }
    }
  };

  if (loading) return <div className="text-center p-12 text-gray-500">Loading spots...</div>;

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Spots</h1>
          <p className="mt-1 text-gray-600">Create and manage your global pool of tour destinations.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          + Create New Spot
        </button>
      </div>

      <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Spot Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {spots.length > 0 ? spots.map((spot) => (
                <tr key={spot.spot_id} className="transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {spot.image ? (
                        <img src={spot.image} alt={spot.name} className="w-10 h-10 rounded-lg object-cover mr-4" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg mr-4 flex items-center justify-center text-gray-500">
                          No Img
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-900">{spot.name}</div>
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                          {spot.description ? spot.description.replace(/<[^>]+>/g, '') : 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {spot.location || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(spot.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(spot)} className="text-blue-500 hover:text-blue-400 mr-4">Edit</button>
                    <button onClick={() => handleDelete(spot.spot_id)} className="text-red-500 hover:text-red-400">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No spots found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-3xl border border-gray-200 w-full max-w-lg overflow-hidden shadow-2xl bg-white">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">{editingSpot ? 'Edit Spot' : 'Create New Spot'}</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Spot Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="e.g. Eiffel Tower"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="e.g. Paris, France"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                  placeholder="Describe this spot..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Image</label>
                <div className="flex items-center space-x-4">
                  {formData.image && (
                    <img src={formData.image} alt="Spot" className="w-16 h-16 rounded-xl object-cover border border-gray-200 bg-white" />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file: file:text-white hover:file: disabled:opacity-50"
                    />
                    {uploadingImage && <p className="text-xs text-blue-400 mt-2">Uploading image...</p>}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 rounded-xl text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {editingSpot ? 'Save Changes' : 'Create Spot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
