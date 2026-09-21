// components/ConditionalChrome.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

/**
 * Renders the public Navigation + Footer on public routes only.
 * Hides them on /admin, /auth, /student, /mentor.
 *
 * To hide them on a new top-level route, add its prefix to hiddenPrefixes.
 */
export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  const hiddenPrefixes = ['/admin', '/auth', '/student', '/mentor'];
  const hide = hiddenPrefixes.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (hide) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
