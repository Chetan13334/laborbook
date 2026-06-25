import { useSyncExternalStore, useState, useEffect } from 'react';
import { appDatabase } from './app-database';
import type { Laborer, LaborProfile } from './types';
import { LaborersService } from '@/backend/services/laborers';

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
      setLoading(true);
      const { data: fetchResult, error: fetchError } = await LaborersService.fetchLaborers();
      if (mounted) {
        if (fetchError) setError(fetchError);
        if (fetchResult) setData(fetchResult);
        setLoading(false);
      }
    }
    fetch();
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
}

export function useLaborProfile(id?: string) {
  const [data, setData] = useState<LaborProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      if (!id) {
        if (mounted) {
          setData(null);
          setLoading(false);
        }
        return;
      }
      
      setLoading(true);
      const { data: fetchResult, error: fetchError } = await LaborersService.fetchLaborProfile(id);
      
      if (mounted) {
        if (fetchError) setError(fetchError);
        if (fetchResult) setData(fetchResult);
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
