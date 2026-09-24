// components/nav/NavbarChooser.tsx
'use client';

import { useEffect, useState } from 'react';
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

  // While loading, show the public nav so there's no layout jump.
  if (loading || !user) {
    return <PublicNavigation />;
  }

  const navUser = {
    fullName: user.fullName,
    email: user.email,
    avatar: user.avatar,
  };

  switch (user.role) {
    case 'admin':
      return <AdminTopBar user={navUser} />;
    case 'publications':
      return <PublicationsNavigation user={navUser} />;
    case 'mentor':
      return <MentorNavigation user={navUser} />;
    case 'student':
    default:
      return <StudentNavigation user={navUser} />;
  }
}
