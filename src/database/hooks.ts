import { useSyncExternalStore } from 'react';
import { appDatabase } from './app-database';

function useDatabaseSnapshot<T>(subscribe: (listener: () => void) => () => void, selector: () => T): T {
  return useSyncExternalStore(subscribe, selector, selector);
}

export function useLaborers() {
  return useDatabaseSnapshot(appDatabase.labor.subscribe, () => appDatabase.labor.getLaborers());
}

export function useLaborProfile(id?: string) {
  return useDatabaseSnapshot(appDatabase.labor.subscribe, () => appDatabase.labor.getLaborProfile(id));
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
