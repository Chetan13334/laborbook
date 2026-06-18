import { ObservableStore } from './store';
import type { CashbookRow } from './types';

export class CashbookRepository extends ObservableStore {
  private rows: CashbookRow[] = [
    { day: '01', weekday: 'Fri', attendance: ['A', 'P', 'OT'] },
    { day: '02', weekday: 'Sat', attendance: ['A', 'P', 'OT'], amount: '₹18,000' },
    { day: '03', weekday: 'Sun', attendance: ['A', 'P', 'OT'], amount: '₹12,400' },
    { day: '04', weekday: 'Mon', attendance: ['A', 'P', 'OT'], amount: '₹8,000' },
    { day: '05', weekday: 'Tue', attendance: ['P', 'OT'], amount: '₹24,000', highlighted: true },
    { day: '06', weekday: 'Wed', attendance: ['A', 'P', 'OT'] },
    { day: '07', weekday: 'Thu', attendance: ['A', 'P', 'OT'], amount: '₹6,400' },
  ];

  getRows() {
    return this.rows;
  }

  addRow(row: CashbookRow) {
    this.rows = [row, ...this.rows];
    this.emitChange();
  }
}
