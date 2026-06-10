import { requireRole } from '@/lib/auth';

export default async function GuideLayout({ children }) {
  await requireRole(['owner', 'manager', 'guide']);
  return <>{children}</>;
}
