import { listLaborCashbookEntries } from '../repositories/cashbook.repository';

export type CashbookEntry = {
  id: string;
  owner_id: string;
  laborer_id: string;
  entry_date: string;
  amount: number;
  entry_type: 'advance' | 'payment' | 'expense' | 'settlement' | 'note';
  note: string | null;
  created_at: string;
  updated_at: string;
};

export const CashbookService = {
  async getLaborCashbook(laborerId: string): Promise<{
    data: CashbookEntry[];
    error: Error | null;
  }> {
    try {
      const { data, error } = await listLaborCashbookEntries(laborerId);
      if (error) throw error;

      return {
        data: (data ?? []) as CashbookEntry[],
        error: null,
      };
    } catch (err) {
      return {
        data: [],
        error: err as Error,
      };
    }
  },
};
