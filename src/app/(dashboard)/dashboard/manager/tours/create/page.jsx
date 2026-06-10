'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import TourForm from '@/components/forms/NewTourForm';
import { toast } from 'react-hot-toast';

export default function CreateTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await axios.post('/api/admin/tours', formData);
      toast.success('Tour created successfully!');
      router.push('/dashboard/manager/tours');
    } catch (error) {
      console.error('Error creating tour:', error);
      toast.error('Failed to create tour. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Create New Tour</h1>
        <p className="mt-1 text-gray-400">Fill out the details below to add a new tour to your catalog.</p>
      </div>

      <TourForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
