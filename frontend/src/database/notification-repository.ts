import { ObservableStore } from './store';
import type { NotificationRecord } from './types';

export class NotificationRepository extends ObservableStore {
  private notifications: NotificationRecord[] = [
    { id: 'payment-reminder', title: 'Payment reminder', desc: 'Rajesh Kumar has a pending amount of ₹12,400.', color: '#bb1712', createdAt: 'Today', unread: true },
    { id: 'attendance-updated', title: 'Attendance updated', desc: '6 laborers are marked present today in the demo database.', color: '#006a66', createdAt: 'Today', unread: true },
    { id: 'backup-completed', title: 'Backup completed', desc: 'Your local demo records were synced into the in-app store.', color: '#00531e', createdAt: 'A few minutes ago', unread: false },
  ];

  getNotifications() {
    return this.notifications;
  }

  addNotification(notification: NotificationRecord) {
    this.notifications = [notification, ...this.notifications];
    this.emitChange();
  }

  markAllRead() {
    this.notifications = this.notifications.map((notification) => ({
      ...notification,
      unread: false,
    }));
    this.emitChange();
  }
}
