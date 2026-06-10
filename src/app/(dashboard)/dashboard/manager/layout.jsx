import { requireRole } from '@/lib/auth';

export default async function ManagerLayout({ children }) {
  await requireRole(['owner', 'manager']);
  return <>{children}</>;
}
