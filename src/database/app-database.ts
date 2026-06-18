import { CashbookRepository } from './cashbook-repository';
import { LaborRepository } from './labor-repository';
import { NotificationRepository } from './notification-repository';
import { SettingsRepository } from './settings-repository';
import type { CashbookRow, CreateLaborInput, Laborer, NotificationRecord } from './types';

export class AppDatabase {
  labor = new LaborRepository();
  cashbook = new CashbookRepository();
  notifications = new NotificationRepository();
  settings = new SettingsRepository();

  createLabor(input: CreateLaborInput) {
    const laborer = this.labor.createLabor(input);

    this.notifications.addNotification({
      id: `labor-${laborer.slug}-${Date.now()}`,
      title: 'Labor added',
      desc: `${laborer.name} was added to the demo database.`,
      color: '#0053da',
      createdAt: 'Just now',
      unread: true,
    });

    return laborer;
  }

  updateLabor(slug: string, patch: Partial<Pick<Laborer, 'name' | 'role' | 'amount' | 'status' | 'badge' | 'badgeBg' | 'badgeText' | 'phone' | 'muted'>> & {
    notes?: string;
  }) {
    return this.labor.updateLabor(slug, patch);
  }

  markLaborPresent(slug: string) {
    return this.labor.markPresent(slug);
  }

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
  __LABORBOOK_DEMO_DB__?: AppDatabase;
};

export const appDatabase = globalScope.__LABORBOOK_DEMO_DB__ ?? new AppDatabase();

if (!globalScope.__LABORBOOK_DEMO_DB__) {
  globalScope.__LABORBOOK_DEMO_DB__ = appDatabase;
}
