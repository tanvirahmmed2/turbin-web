import VerifyEmail from '@/components/forms/VerifyEmail';
import { Suspense } from 'react';

export const metadata = {
  title: 'Verify Email - Tour Booking',
  description: 'Verify your account email address',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/20 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
          <VerifyEmail />
        </Suspense>
      </div>
    </div>
  );
}
