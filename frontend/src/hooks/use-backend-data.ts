import { useEffect, useState } from 'react';
import { fetchLaborers, fetchLaborProfile } from '@backend/controllers/labor.controller';
import { listAllCashbookEntries } from '@backend/controllers/cashbook.controller';
import type { LaborerRecord, LaborProfileRecord, CashbookRow } from '@/types/app';

export function useLaborers() {
  const [data, setData] = useState<LaborerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await fetchLaborers();
      if (!mounted) return;
      setData(result.data as LaborerRecord[]);
      setError(result.error);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useLaborProfile(id?: string) {
  const [data, setData] = useState<LaborProfileRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      const result = await fetchLaborProfile(id);
      if (!mounted) return;
      setData(result.data as LaborProfileRecord | null);
      setError(result.error);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  return { data, loading, error };
}

export function useCashbookRows() {
  const [data, setData] = useState<CashbookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const result = await listAllCashbookEntries();
      if (!mounted) return;
      setData(result.data as CashbookRow[]);
      setError(result.error);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useNotifications() {
  return { data: [] as { id: string; title: string; desc: string; color: string }[], loading: false, error: null };
}
