import { supabase } from "@/backend/client";
import { useEffect, useState } from "react";

export type CashbookEntry = {
  id: string;
  owner_id: string;
  laborer_id: string;
  entry_date: string;
  amount: number;
  entry_type: "advance" | "payment" | "expense" | "settlement" | "note";
  note: string | null;
  created_at: string;
  updated_at: string;
};


export function useLaborCashbook(laborerId: string) {
  const [data, setData] = useState<CashbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!laborerId) return;

    async function loadCashbook() {
      setLoading(true);

      const result = await CashbookService.getLaborCashbook(laborerId);

      setData(result.data);
      setError(result.error);
      setLoading(false);
    }

    loadCashbook();
  }, [laborerId]);

  return {
    data,
    loading,
    error,
  };
}

export const CashbookService = {
  async getLaborCashbook(laborerId: string): Promise<{
    data: CashbookEntry[];
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase
        .from("labor_cashbook_entries")
        .select("*")
        .eq("laborer_id", laborerId)
        .order("entry_date", { ascending: false });

      console.log("========== CASHBOOK ==========");
      console.log("Laborer ID:", laborerId);
      console.log("Data:", data);
      console.log("Error:", error);
      console.log("==============================");

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