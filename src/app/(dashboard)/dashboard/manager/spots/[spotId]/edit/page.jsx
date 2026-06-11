'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter, useParams } from 'next/navigation';
import SpotForm from '@/components/forms/SpotForm';

export default function EditSpotPage() {
  const { spotId } = useParams();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const res = await axios.get('/api/admin/spots');
        // Find the specific spot since the API returns all spots
        const spot = res.data.spots.find((s) => s.spot_id == spotId);
        if (spot) {
          setInitialData(spot);
        } else {
          toast.error('Spot not found');
          router.push('/dashboard/manager/spots');
        }
      } catch (err) {
        console.error('Failed to load spot', err);
        toast.error('Failed to load spot details');
      } finally {
        setLoading(false);
      }
    };
    fetchSpot();
  }, [spotId, router]);

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      await axios.put(`/api/admin/spots/${spotId}`, formData);
      toast.success('Spot updated successfully');
      router.push('/dashboard/manager/spots');
    } catch (error) {
      console.error('Error updating spot', error);
      toast.error('Failed to update spot');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-12 text-gray-500">Loading spot details...</div>;
  }

  if (!initialData) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Spot</h1>
        <p className="mt-1 text-gray-600">Update the details for this destination.</p>
      </div>

      <SpotForm initialData={initialData} onSubmit={handleUpdate} loading={saving} />
    </div>
  );
}
