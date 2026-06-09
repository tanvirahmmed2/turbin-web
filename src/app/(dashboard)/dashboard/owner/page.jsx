'use client';

import ManagerDashboard from '../manager/page';

export default function OwnerDashboard() {
  // For the sake of this implementation, the Owner dashboard uses the same 
  // core operations view as the Manager dashboard, as they share the same API.
  return <ManagerDashboard />;
}
