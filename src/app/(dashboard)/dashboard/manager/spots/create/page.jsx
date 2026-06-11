'use client';

import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import SpotForm from '@/components/forms/SpotForm';

export default function CreateSpotPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (formData) => {
    setLoading(true);
    try {
      await axios.post('/api/admin/spots', formData);
      toast.success('Spot created successfully');
      router.push('/dashboard/manager/spots');
    } catch (error) {
      console.error('Error saving spot', error);
      toast.error('Failed to create spot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create New Spot</h1>
        <p className="mt-1 text-gray-600">Add a new destination or activity spot to your catalog.</p>
      </div>

      <SpotForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}
