import { requireRole } from '@/lib/auth';

export default async function StaffLayout({ children }) {
  await requireRole(['owner', 'manager', 'staff']);
  return <>{children}</>;
}
