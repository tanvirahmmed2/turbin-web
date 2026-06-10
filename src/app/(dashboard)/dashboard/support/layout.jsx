import { requireRole } from '@/lib/auth';

export default async function SupportLayout({ children }) {
  await requireRole(['owner', 'manager', 'support']);
  return <>{children}</>;
}
