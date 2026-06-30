import { ObservableStore } from './store';
import type { CashbookRow } from './types';

export class CashbookRepository extends ObservableStore {
  private rows: CashbookRow[] = [
    { day: '01', weekday: 'Fri', label: 'Petrol', notes: 'Diesel refill', attendance: ['A', 'P', 'OT'] },
    { day: '02', weekday: 'Sat', label: 'Site Lunch', notes: 'Workers lunch', attendance: ['A', 'P', 'OT'], amount: '₹18,000' },
    { day: '03', weekday: 'Sun', label: 'Material Purchase', notes: 'Cement bags', attendance: ['A', 'P', 'OT'], amount: '₹12,400' },
    { day: '04', weekday: 'Mon', label: 'Transport', notes: 'Truck rent', attendance: ['A', 'P', 'OT'], amount: '₹8,000' },
    { day: '05', weekday: 'Tue', label: 'Advance Payment', notes: 'Site advance', attendance: ['P', 'OT'], amount: '₹24,000', highlighted: true },
    { day: '06', weekday: 'Wed', label: 'Misc Expense', notes: 'Small tools', attendance: ['A', 'P', 'OT'] },
    { day: '07', weekday: 'Thu', label: 'Rent', notes: 'Office rent', attendance: ['A', 'P', 'OT'], amount: '₹6,400' },
  ];

  getRows() {
    return this.rows;
  }

  addRow(row: CashbookRow) {
    this.rows = [row, ...this.rows];
    this.emitChange();
  }

  updateRow(day: string, patch: Partial<CashbookRow>) {
    let updated = false;
    this.rows = this.rows.map((row) => {
      if (row.day !== day) return row;
      updated = true;
      return { ...row, ...patch };
    });
    if (updated) this.emitChange();
    return updated;
  }
}
