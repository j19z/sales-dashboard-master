import { createClient } from '@/utils/supabase/server';

export type UserRole = 'administrator' | 'sales_director' | 'sales_manager' | 'sales_supervisor';

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
}

const ROLE_LABELS: Record<UserRole, string> = {
  administrator: 'Administrator',
  sales_director: 'Sales Director',
  sales_manager: 'Sales Manager',
  sales_supervisor: 'Sales Supervisor',
};

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role] || role;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // Fallback: return basic info from auth metadata
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name || user.email || 'User',
      role: 'sales_supervisor',
    };
  }

  return profile as UserProfile;
}
