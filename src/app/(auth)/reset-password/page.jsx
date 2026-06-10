import ResetPasswordForm from '@/components/forms/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password - Tour Booking',
  description: 'Set a new password',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full flex justify-center">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
