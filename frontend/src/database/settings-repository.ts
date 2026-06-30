import { ObservableStore } from './store';
import type { SettingsRecord } from './types';

export class SettingsRepository extends ObservableStore {
  private settings: SettingsRecord = {
    mode: 'light',
    notificationsEnabled: true,
    language: 'English',
    currency: 'INR (₹)',
    backupStatus: 'Auto sync enabled',
  };

  getSettings() {
    return this.settings;
  }

  setMode(mode: SettingsRecord['mode']) {
    this.settings = { ...this.settings, mode };
    this.emitChange();
  }

  toggleNotifications() {
    this.settings = { ...this.settings, notificationsEnabled: !this.settings.notificationsEnabled };
    this.emitChange();
  }
}
