'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import TourForm from '@/components/forms/NewTourForm';
import { toast } from 'react-hot-toast';

export default function EditTourPage() {
  const router = useRouter();
  const { tourId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await axios.get(`/api/admin/tours/${tourId}`);
        setInitialData(res.data.tour);
      } catch (error) {
        console.error('Error fetching tour:', error);
        toast.error('Failed to load tour details.');
        router.push('/dashboard/manager/tours');
      } finally {
        setFetching(false);
      }
    };
    if (tourId) fetchTour();
  }, [tourId, router]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await axios.put(`/api/admin/tours/${tourId}`, formData);
      toast.success('Tour updated successfully!');
      router.push('/dashboard/manager/tours');
    } catch (error) {
      console.error('Error updating tour:', error);
      toast.error('Failed to update tour. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center p-12 text-gray-500">Loading tour details...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Edit Tour</h1>
        <p className="mt-1 text-gray-400">Update the details and spots for this tour.</p>
      </div>

      {initialData && (
        <TourForm 
          initialData={initialData} 
          onSubmit={handleSubmit} 
          loading={loading} 
        />
      )}
    </div>
  );
}
