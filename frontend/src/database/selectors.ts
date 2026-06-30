import { parseRupees } from './helpers';
import type { CashbookRow, LaborProfileRecord, LaborerRecord } from './types';

export function buildDashboardSnapshot(laborers: LaborerRecord[], rows: CashbookRow[]) {
  const totalLabor = laborers.length;
  const presentToday = laborers.filter((laborer) => laborer.status === 'Present').length;
  const pendingPaymentsValue = laborers.reduce((sum, laborer) => (laborer.badge === 'Unpaid' ? sum + parseRupees(laborer.amount) : sum), 0);
  const monthlyExpensesValue = rows.reduce((sum, row) => sum + parseRupees(row.amount ?? '0'), 0);

  return {
    totalLabor,
    presentToday,
    attendanceRate: totalLabor > 0 ? `${Math.round((presentToday / totalLabor) * 100)}%` : '0%',
    pendingPayments: `₹${pendingPaymentsValue.toLocaleString('en-IN')}`,
    monthlyExpenses: `₹${monthlyExpensesValue.toLocaleString('en-IN')}`,
    siteTransfers: laborers.filter((laborer) => laborer.role.toLowerCase().includes('supervisor') || laborer.role.toLowerCase().includes('mason')).length,
    recentLaborers: laborers.slice(0, 3),
  };
}

export function buildReportSnapshot(laborers: LaborerRecord[], profiles: Record<string, LaborProfileRecord>, rows: CashbookRow[]) {
  const dashboard = buildDashboardSnapshot(laborers, rows);
  const paidThisMonthValue = rows.reduce((sum, row) => sum + parseRupees(row.amount ?? '0'), 0);
  const pendingDueValue = Object.values(profiles).reduce((sum, profile) => sum + parseRupees(profile.pendingDues), 0);

  return {
    ...dashboard,
    paidThisMonth: `₹${paidThisMonthValue.toLocaleString('en-IN')}`,
    pendingDue: `₹${pendingDueValue.toLocaleString('en-IN')}`,
  };
}
