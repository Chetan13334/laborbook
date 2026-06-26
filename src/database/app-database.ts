import { CashbookRepository } from './cashbook-repository';
import { NotificationRepository } from './notification-repository';
import { SettingsRepository } from './settings-repository';
import type { CashbookRow, NotificationRecord } from './types';

export class AppDatabase {
  cashbook = new CashbookRepository();
  notifications = new NotificationRepository();
  settings = new SettingsRepository();

  addCashbookRow(row: CashbookRow) {
    this.cashbook.addRow(row);

    this.notifications.addNotification({
      id: `cashbook-${row.day}-${row.weekday}-${Date.now()}`,
      title: 'Cashbook updated',
      desc: `Added a cashbook row for ${row.weekday}.`,
      color: '#006a66',
      createdAt: 'Just now',
      unread: true,
    });
  }

  updateCashbookRow(day: string, patch: Partial<CashbookRow>) {
    return this.cashbook.updateRow(day, patch);
  }

  addNotification(notification: NotificationRecord) {
    this.notifications.addNotification(notification);
  }

  markAllNotificationsRead() {
    this.notifications.markAllRead();
  }

  setMode(mode: 'light' | 'dark') {
    this.settings.setMode(mode);
  }

  toggleNotifications() {
    this.settings.toggleNotifications();
  }
}

const globalScope = globalThis as typeof globalThis & {
  __SiteBook_DEMO_DB__?: AppDatabase;
};

export const appDatabase = globalScope.__SiteBook_DEMO_DB__ ?? new AppDatabase();

if (!globalScope.__SiteBook_DEMO_DB__) {
  globalScope.__SiteBook_DEMO_DB__ = appDatabase;
}
