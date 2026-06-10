import { requireRole } from '@/lib/auth';

export default async function OwnerLayout({ children }) {
  await requireRole(['owner']);
  return <>{children}</>;
}
