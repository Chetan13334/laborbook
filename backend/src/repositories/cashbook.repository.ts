import { supabase } from '../config/supabase.client';

export async function listLaborCashbookEntries(laborerId: string) {
  return supabase
    .from('labor_cashbook_entries')
    .select('*')
    .eq('laborer_id', laborerId)
    .order('entry_date', { ascending: false });
}

export async function listAllCashbookEntries() {
  return supabase
    .from('labor_cashbook_entries')
    .select('*')
    .order('entry_date', { ascending: false });
}
