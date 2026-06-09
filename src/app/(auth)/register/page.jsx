import RegisterForm from '@/components/forms/RegisterForm';

export const metadata = {
  title: 'Register - Tour Booking',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] p-4 relative overflow-hidden">
      {/* Background gradients for a premium feel */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full flex justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
