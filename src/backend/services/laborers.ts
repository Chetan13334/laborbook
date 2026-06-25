import { supabase } from '@/backend/client';
import type { Laborer, LaborProfile } from '@/database/types';

export const LaborersService = {
  async fetchLaborers(): Promise<{ data: Laborer[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('laborers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map from snake_case database schema to camelCase frontend schema
      const mapped = (data || []).map(item => ({
        slug: item.slug,
        initials: item.initials,
        name: item.name,
        role: item.role,
        status: item.status,
        amount: item.amount,
        amountColor: item.amount_color,
        badge: item.badge,
        badgeBg: item.badge_bg,
        badgeText: item.badge_text,
        muted: item.muted,
        phone: item.phone,
      }));

      return { data: mapped as Laborer[], error: null };
    } catch (err: any) {
      return { data: [], error: err as Error };
    }
  },

  async fetchLaborProfile(id: string): Promise<{ data: LaborProfile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('laborers')
        .select('*')
        .eq('slug', id)
        .single();

      if (error) throw error;
      if (!data) return { data: null, error: null };

      // Simplified mapping based on existing frontend types
      // Depending on how much real backend we have, we'll map fields appropriately.
      const profile: LaborProfile = {
        id: data.slug,
        name: data.name,
        role: data.role || '',
        dailyRate: data.amount || '₹0',
        joinedDate: data.created_at ? new Date(data.created_at).toLocaleDateString() : 'Unknown',
        workSites: 'Supabase Sync',
        pendingDues: '₹0',
        duesNote: 'Managed via Supabase',
        attendance: { present: 0, absent: 0, upcoming: 0 },
        activity: [],
        payments: [],
        notes: data.notes || '',
      };

      return { data: profile, error: null };
    } catch (err: any) {
      return { data: null, error: err as Error };
    }
  },
};
