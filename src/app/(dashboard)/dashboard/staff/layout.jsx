import { requireRole } from '@/lib/auth';

export default async function StaffLayout({ children }) {
  await requireRole(['staff']);
  return <>{children}</>;
}
