export type LaborerRow = {
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
