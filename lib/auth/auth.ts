// lib/auth/auth.ts
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get('sb-access-token');
  
  if (!token) {
    return null;
  }

  const { data: { user }, error } = await supabase.auth.getUser(token.value);
  
  if (error) {
    return null;
  }

  return user;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.id)
    .single();

  if (error) {
    return null;
  }

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireRole(role: string | string[]) {
  const user = await requireAuth();
  const roles = Array.isArray(role) ? role : [role];
  
  if (!roles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  
  return user;
}
