export type LaborStatus = 'Present' | 'Absent';

export type LaborerRecord = {
  id: string;
  slug: string;
  initials: string;
  name: string;
  role: string;
  status: LaborStatus;
  amount: string;
  amountColor: string;
  badge?: string;
  badgeBg?: string;
  badgeText?: string;
  muted?: boolean;
  phone?: string;
};

export type LaborProfileRecord = {
  id: string;
  name: string;
  role: string;
  dailyRate: string;
  joinedDate: string;
  workSites: string;
  pendingDues: string;
  duesNote: string;
  attendance: { present: number; absent: number; upcoming: number };
  activity: { title: string; time: string; description: string; icon: string; color: string }[];
  payments: { title: string; ref: string; date: string; amount: string }[];
  notes?: string;
};

export type CashbookRow = {
  day: string;
  weekday: string;
  label?: string;
  notes?: string;
  attendance: ('A' | 'P' | 'OT')[];
  amount?: string;
  highlighted?: boolean;
};

