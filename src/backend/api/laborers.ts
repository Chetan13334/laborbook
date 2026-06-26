import { supabase } from '@/backend/client';
import type { Laborer, LaborProfile } from '@/database/types';

type LaborerRow = {
  id: string;
  owner_id: string;
  full_name: string;
  phone: string | null;
  work_type: string | null;
  daily_wage: number | null;
  address: string | null;
  notes: string | null;
  created_at?: string | null;
};

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) return '₹0';
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function mapLaborer(row: LaborerRow): Laborer {
  return {
    id: row.id,
    slug: row.id,
    initials: getInitials(row.full_name),
    name: row.full_name,
    role: row.work_type ?? 'Labor',
    status: 'Present',
    amount: formatCurrency(row.daily_wage),
    amountColor: '#006e2a',
    badge: row.daily_wage !== null && row.daily_wage !== undefined ? 'Daily' : undefined,
    badgeBg: 'rgba(0, 110, 42, 0.10)',
    badgeText: '#006e2a',
    muted: false,
    phone: row.phone ?? undefined,
  };
}

function mapProfile(row: LaborerRow): LaborProfile {
  return {
    id: row.id,
    name: row.full_name,
    role: row.work_type ?? 'Labor',
    dailyRate: formatCurrency(row.daily_wage),
    joinedDate: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Unknown',
    workSites: row.address ?? 'Not added',
    pendingDues: '₹0',
    duesNote: 'Cashbook integration pending',
    attendance: { present: 0, absent: 0, upcoming: 0 },
    activity: [],
    payments: [],
    notes: row.notes ?? '',
  };
}

export async function fetchLaborers(): Promise<{ data: Laborer[]; error: Error | null }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('[fetchLaborers] session user id:', sessionData.session?.user?.id ?? null);

    const { data, error } = await supabase
      .from('laborers')
      .select('id, owner_id, full_name, phone, work_type, daily_wage, created_at')
      .order('created_at', { ascending: false });

      console.log("==========");
console.log("DATA:", data);
console.log("ERROR:", error);
console.log("==========");
    console.log('[fetchLaborers] raw rows:', data);
    console.log('[fetchLaborers] error:', error);

    if (error) throw error;

    const mapped = (data ?? []).map((row) => mapLaborer(row as LaborerRow));
    console.log('[fetchLaborers] mapped laborers:', mapped);

    return { data: mapped, error: null };
  } catch (err: any) {
    console.log('fetchLaborers api error =>', err);
    return { data: [], error: err as Error };
  }
}

export async function fetchLaborProfile(id: string): Promise<{ data: LaborProfile | null; error: Error | null }> {
  try {
    console.log('[fetchLaborProfile] incoming id:', id);
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('[fetchLaborProfile] session user id:', sessionData.session?.user?.id ?? null);

    const { data, error } = await supabase
      .from('laborers')
      .select('id, owner_id, full_name, phone, work_type, daily_wage, address, notes, created_at')
      .eq('id', id)
      .maybeSingle();

    console.log('[fetchLaborProfile] raw row:', data);
    console.log('[fetchLaborProfile] error:', error);

    if (error) throw error;
    if (!data) return { data: null, error: null };

    return { data: mapProfile(data as LaborerRow), error: null };
  } catch (err: any) {
    console.log('fetchLaborProfile api error =>', err);
    return { data: null, error: err as Error };
  }
}

export async function createLabor(input: {
  name: string;
  phone?: string;
  role?: string;
  amount?: string;
  notes?: string;
}) {
  try {
    const parsedAmount = Number(String(input.amount ?? '').replace(/[^\d.-]/g, ''));
    const { data, error } = await supabase
      .from('laborers')
      .insert({
        full_name: input.name.trim(),
        phone: input.phone?.trim() || null,
        work_type: input.role?.trim() || null,
        daily_wage: Number.isFinite(parsedAmount) ? parsedAmount : null,
        notes: input.notes?.trim() || null,
      })
      .select('id')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.log('createLabor api error =>', err);
    return { data: null, error: err as Error };
  }
}

export async function updateLabor(id: string, patch: { name?: string; role?: string; amount?: string }) {
  try {
    const parsedAmount = patch.amount ? Number(String(patch.amount).replace(/[^\d.-]/g, '')) : undefined;
    const updates: Record<string, string | number | null> = {};
    if (patch.name !== undefined) updates.full_name = patch.name.trim();
    if (patch.role !== undefined) updates.work_type = patch.role.trim() || null;
    if (patch.amount !== undefined) updates.daily_wage = Number.isFinite(parsedAmount ?? NaN) ? parsedAmount ?? null : null;

    const { data, error } = await supabase
      .from('laborers')
      .update(updates)
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    console.log('updateLabor api error =>', err);
    return { data: null, error: err as Error };
  }
}
