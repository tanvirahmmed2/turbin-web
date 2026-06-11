import ForgetPasswordForm from '@/components/forms/ForgetPasswordForm';

export const metadata = {
  title: 'Forgot Password - Tour Booking',
  description: 'Reset your password',
};

export default function ForgetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full flex justify-center">
        <ForgetPasswordForm />
      </div>
    </div>
  );
}
