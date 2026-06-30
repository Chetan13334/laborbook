import { getLaborerById, insertLaborer, listLaborers, updateLaborerById } from '../repositories/laborer.repository';
import type { LaborerRow } from '../models/laborer.types';

type Laborer = {
  id: string;
  slug: string;
  initials: string;
  name: string;
  role: string;
  status: 'Present' | 'Absent';
  amount: string;
  amountColor: string;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  muted?: boolean;
  phone?: string;
};

type LaborProfile = {
  id: string;
  name: string;
  role: string;
  dailyRate: string;
  joinedDate: string;
  workSites: string;
  pendingDues: string;
  duesNote: string;
  attendance: { present: number; absent: number; upcoming: number };
  activity: { title: string; time: string; description: string; icon: string; color: string }[];
  payments: { title: string; ref: string; date: string; amount: string }[];
  notes?: string;
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
    const { data: sessionData } = await (await import('../config/supabase.client')).supabase.auth.getSession();
    console.log('[fetchLaborers] session user id:', sessionData.session?.user?.id ?? null);

    const { data, error } = await listLaborers();
    if (error) throw error;

    return { data: (data ?? []).map((row) => mapLaborer(row as LaborerRow)), error: null };
  } catch (err: any) {
    return { data: [], error: err as Error };
  }
}

export async function fetchLaborProfile(id: string): Promise<{ data: LaborProfile | null; error: Error | null }> {
  try {
    const { data, error } = await getLaborerById(id);
    if (error) throw error;
    if (!data) return { data: null, error: null };
    return { data: mapProfile(data as LaborerRow), error: null };
  } catch (err: any) {
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
    const { data, error } = await insertLaborer({
      full_name: input.name.trim(),
      phone: input.phone?.trim() || null,
      work_type: input.role?.trim() || null,
      daily_wage: Number.isFinite(parsedAmount) ? parsedAmount : null,
      notes: input.notes?.trim() || null,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err as Error };
  }
}

export async function updateLabor(id: string, patch: { name?: string; role?: string; amount?: string }) {
  try {
    const parsedAmount = patch.amount ? Number(String(patch.amount).replace(/[^\d.-]/g, '')) : undefined;
    const updates: Partial<LaborerRow> = {};
    if (patch.name !== undefined) updates.full_name = patch.name.trim();
    if (patch.role !== undefined) updates.work_type = patch.role.trim() || null;
    if (patch.amount !== undefined) updates.daily_wage = Number.isFinite(parsedAmount ?? NaN) ? parsedAmount ?? null : null;

    const { data, error } = await updateLaborerById(id, updates);
    if (error) throw error;
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err as Error };
  }
}
