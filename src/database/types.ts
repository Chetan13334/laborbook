export type LaborStatus = 'Present' | 'Absent';

export type Laborer = {
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

export type LaborProfile = {
  id: string;
  name: string;
  role: string;
  dailyRate: string;
  joinedDate: string;
  workSites: string;
  pendingDues: string;
  duesNote: string;
  attendance: {
    present: number;
    absent: number;
    upcoming: number;
  };
  activity: {
    title: string;
    time: string;
    description: string;
    icon: string;
    color: string;
  }[];
  payments: {
    title: string;
    ref: string;
    date: string;
    amount: string;
  }[];
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

export type NotificationRecord = {
  id: string;
  title: string;
  desc: string;
  color: string;
  createdAt?: string;
  unread?: boolean;
  read?: boolean;
};

export type NotificationStateRecord = NotificationRecord & {
  read?: boolean;
};

export type SettingsRecord = {
  mode: 'light' | 'dark';
  notificationsEnabled?: boolean;
  language?: string;
  currency?: string;
  backupStatus?: string;
};

export type LaborerRecord = Laborer;
export type LaborProfileRecord = LaborProfile;

export type CreateLaborInput = {
  name: string;
  phone?: string;
  role?: string;
  salaryMode: 'daily' | 'monthly';
  amount: string;
  notes?: string;
  entryMode: 'contacts' | 'manual';
};
