import { requireRole } from '@/lib/auth';

export default async function ManagerLayout({ children }) {
  await requireRole(['manager']);
  return <>{children}</>;
}
