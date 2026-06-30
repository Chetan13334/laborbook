import { supabase } from '../config/supabase.client';
import type { LaborerRow } from '../models/laborer.types';

export async function listLaborers() {
  return supabase
    .from('laborers')
    .select('id, owner_id, full_name, phone, work_type, daily_wage, created_at')
    .order('created_at', { ascending: false });
}

export async function getLaborerById(id: string) {
  return supabase
    .from('laborers')
    .select('id, owner_id, full_name, phone, work_type, daily_wage, address, notes, created_at')
    .eq('id', id)
    .maybeSingle();
}

export async function insertLaborer(input: {
  full_name: string;
  phone: string | null;
  work_type: string | null;
  daily_wage: number | null;
  notes: string | null;
}) {
  return supabase.from('laborers').insert(input).select('id').single();
}

export async function updateLaborerById(id: string, updates: Partial<LaborerRow>) {
  return supabase.from('laborers').update(updates).eq('id', id).select('id').single();
}