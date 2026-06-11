'use client';

export default function CustomerSettings() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">Manage your profile and account preferences.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white" defaultValue="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white" defaultValue="john@example.com" disabled />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed directly.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input type="tel" className="w-full md:w-1/2 px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white" placeholder="+1 (555) 000-0000" />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <button type="button" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Security</h2>
        <form className="space-y-6 md:w-1/2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input type="password" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white" />
          </div>
          <div className="pt-4">
            <button type="button" className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl transition-colors bg-white">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
