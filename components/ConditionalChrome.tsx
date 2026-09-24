// components/ConditionalChrome.tsx
'use client';

import { usePathname } from 'next/navigation';
import { NavbarChooser } from './nav/NavbarChooser';
import { Footer } from './Footer';

/**
 * Renders the role-appropriate top nav + Footer on public routes only.
 * Hides them on /admin and /auth.
 *
 * To hide them on a new top-level route, add its prefix to hiddenPrefixes.
 */
export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';

  const hiddenPrefixes = ['/admin', '/auth'];
  const hide = hiddenPrefixes.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  if (hide) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <NavbarChooser />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
