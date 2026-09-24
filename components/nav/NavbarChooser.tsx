// components/nav/NavbarChooser.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PublicNavigation } from './PublicNavigation';
import { StudentNavigation } from './StudentNavigation';
import { MentorNavigation } from './MentorNavigation';
import { PublicationsNavigation } from './PublicationsNavigation';
import { AdminTopBar } from './AdminTopBar';

type AuthUser = {
  fullName: string;
  email: string;
  avatar?: string | null;
  role: string;
  isMentor?: boolean | null;
  mentorStatus?: string | null;
};

export function NavbarChooser() {
  const pathname = usePathname() || '/';
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setUser(data.user);
        }
      } catch {
        // not logged in
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading || !user) {
    return <PublicNavigation />;
  }

  const navUser = {
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
  };

  if (user.role === 'admin') {
    return <AdminTopBar user={navUser} />;
  }
  if (user.role === 'publications') {
    return <PublicationsNavigation user={navUser} />;
  }

  const isApprovedMentor =
    user.isMentor === true && user.mentorStatus === 'approved';

  const onMentorRoute =
    pathname === '/mentor' || pathname.startsWith('/mentor/');

  if (isApprovedMentor && onMentorRoute) {
    return <MentorNavigation user={navUser} />;
  }

  return <StudentNavigation user={navUser} />;
}
