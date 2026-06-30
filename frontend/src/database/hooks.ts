import { useSyncExternalStore, useState, useEffect } from 'react';
import { appDatabase } from './app-database';
import type { Laborer, LaborProfile } from './types';
import { fetchLaborers, fetchLaborProfile } from '@backend/api/laborers';
import { CashbookService, type CashbookEntry } from '@backend/services/cashbook';


function useDatabaseSnapshot<T>(subscribe: (listener: () => void) => () => void, selector: () => T): T {
  return useSyncExternalStore(subscribe, selector, selector);
}

export function useLaborers() {
  const [data, setData] = useState<Laborer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      console.log('[useLaborers] loading started');
      setLoading(true);
      const result = await fetchLaborers();
      console.log('[useLaborers] service result:', result);
      if (mounted) {
        if (result.error) setError(result.error);
        if (result.data) setData(result.data);
        console.log('[useLaborers] setting state:', {
          dataLength: result.data?.length ?? 0,
          error: result.error,
        });
        setLoading(false);
      }
    }
    fetch();
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
}



export function useLaborCashbook(laborerId: string) {
  const [data, setData] = useState<CashbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!laborerId) return;

    async function loadCashbook() {
      setLoading(true);

      const result = await CashbookService.getLaborCashbook(laborerId);

      console.log("Cashbook Hook:", result);

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

export function useLaborProfile(id?: string) {
  const [data, setData] = useState<LaborProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      console.log('[useLaborProfile] incoming id:', id);
      if (!id) {
        if (mounted) {
          setData(null);
          setLoading(false);
        }
        return;
      }
      
      setLoading(true);
      const result = await fetchLaborProfile(id);
      console.log('[useLaborProfile] service result:', result);
      
      if (mounted) {
        if (result.error) setError(result.error);
        if (result.data) setData(result.data);
        setLoading(false);
      }
    }
    
    fetch();
    return () => { mounted = false; };
  }, [id]);

  return { data, loading, error };
}

export function useCashbookRows() {
  return useDatabaseSnapshot(appDatabase.cashbook.subscribe, () => appDatabase.cashbook.getRows());
}

export function useNotifications() {
  return useDatabaseSnapshot(appDatabase.notifications.subscribe, () => appDatabase.notifications.getNotifications());
}

export function useSettings() {
  return useDatabaseSnapshot(appDatabase.settings.subscribe, () => appDatabase.settings.getSettings());
}
