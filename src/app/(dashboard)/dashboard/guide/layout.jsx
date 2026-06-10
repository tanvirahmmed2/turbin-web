import { requireRole } from '@/lib/auth';

export default async function GuideLayout({ children }) {
  await requireRole(['guide']);
  return <>{children}</>;
}
