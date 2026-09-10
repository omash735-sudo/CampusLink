// components/SuperAccessBannerServer.tsx
import { hasSuperAccess, getCurrentUser } from '@/lib/auth';
import SuperAccessBanner from './SuperAccessBanner';

export default async function SuperAccessBannerServer({
  as,
}: {
  as: 'mentor' | 'student' | 'dashboard';
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (user.role !== 'admin') return null;
  if (!hasSuperAccess()) return null;
  return <SuperAccessBanner as={as} />;
}
