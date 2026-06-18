import type { CashbookRow, CreateLaborInput, LaborProfile, Laborer, NotificationRecord, SettingsRecord } from '@/database';
import { formatRupees, getInitials, parseRupees, slugify } from './helpers';

type Listener = () => void;

function cloneProfile(profile: LaborProfile): LaborProfile {
  return {
    ...profile,
    attendance: { ...profile.attendance },
    activity: profile.activity.map((item: LaborProfile['activity'][number]) => ({ ...item })),
    payments: profile.payments.map((item: LaborProfile['payments'][number]) => ({ ...item })),
  };
}

const seedLaborers: Laborer[] = [
  { slug: 'rajesh-kumar', initials: 'RK', name: 'Rajesh Kumar', role: 'Mason', status: 'Present', amount: '₹12,400', amountColor: '#bb1712', badge: 'Unpaid', badgeBg: '#ba1a1a1a', badgeText: '#ba1a1a' },
  { slug: 'manoj-singh', initials: 'MS', name: 'Manoj Singh', role: 'Helper', status: 'Present', amount: '₹5,400', amountColor: '#006e2a', badge: 'Paid', badgeBg: '#8ffa9b33', badgeText: '#00531e' },
  { slug: 'amit-patel', initials: 'AP', name: 'Amit Patel', role: 'Electrician', status: 'Absent', amount: '₹0', amountColor: '#414754', muted: true },
  { slug: 'suresh-tiwari', initials: 'ST', name: 'Suresh Tiwari', role: 'Carpenter', status: 'Present', amount: '₹8,200', amountColor: '#bb1712', badge: 'Unpaid', badgeBg: '#ba1a1a1a', badgeText: '#ba1a1a' },
  { slug: 'vikram-k', initials: 'VK', name: 'Vikram K.', role: 'Painter', status: 'Present', amount: '₹3,800', amountColor: '#006e2a', badge: 'Paid', badgeBg: '#8ffa9b33', badgeText: '#00531e' },
];

const seedProfiles: Record<string, LaborProfile> = {
  gaurav: {
    id: 'gaurav',
    name: 'Gaurav',
    role: 'Site Supervisor',
    dailyRate: '₹1,000.00',
    joinedDate: '03 May 2024',
    workSites: 'Orion Heights, Vesta Plaza',
    pendingDues: '₹10,000.00',
    duesNote: 'Active ledger for the selected month and site activity.',
    attendance: { present: 20, absent: 1, upcoming: 9 },
    activity: [
      { title: 'Attendance Updated', time: 'Today, 08:30 AM', description: 'Morning attendance recorded for the current site.', icon: 'check', color: '#0053da' },
      { title: 'Advance Logged', time: 'Yesterday', description: 'Advance payment recorded in the cashbook.', icon: 'payments', color: '#006a66' },
      { title: 'Report Shared', time: '14 May, 2026', description: 'Monthly ledger snapshot shared with the team.', icon: 'construction', color: '#0e6500' },
    ],
    payments: [
      { title: 'May Advance', ref: '#TXN-010145', date: '15 May 2026', amount: '₹5,000.00' },
      { title: 'April Settlement', ref: '#TXN-010009', date: '02 May 2026', amount: '₹20,000.00' },
    ],
  },
  'rajesh-kumar': {
    id: 'rajesh-kumar',
    name: 'Rajesh Kumar',
    role: 'Skilled Mason',
    dailyRate: '₹850.00',
    joinedDate: '12 Oct 2023',
    workSites: 'Vesta Plaza, Orion Heights',
    pendingDues: '₹12,400.00',
    duesNote: 'Unpaid amount for 14 working days including overtime.',
    attendance: { present: 12, absent: 2, upcoming: 16 },
    activity: [
      { title: 'Marked Present', time: 'Today, 08:30 AM', description: 'Logged attendance for Orion Heights site. Shift start recorded.', icon: 'check', color: '#0053da' },
      { title: 'Partial Payment Released', time: 'Yesterday', description: 'Payment of ₹5,000.00 processed via Bank Transfer.', icon: 'payments', color: '#006a66' },
      { title: 'Site Transfer', time: '14 Jan, 2024', description: 'Moved from Vesta Plaza to Orion Heights Project.', icon: 'construction', color: '#0e6500' },
    ],
    payments: [
      { title: 'January Salary (Advance)', ref: '#TXN-008912', date: '15 Jan 2024', amount: '₹5,000.00' },
      { title: 'December Settlement', ref: '#TXN-007742', date: '02 Jan 2024', amount: '₹24,500.00' },
    ],
  },
  'manoj-singh': {
    id: 'manoj-singh',
    name: 'Manoj Singh',
    role: 'Helper',
    dailyRate: '₹650.00',
    joinedDate: '22 Mar 2024',
    workSites: 'Orion Heights',
    pendingDues: '₹3,250.00',
    duesNote: 'Helper cashbook summary for the current cycle.',
    attendance: { present: 16, absent: 3, upcoming: 9 },
    activity: [
      { title: 'Present Marked', time: 'Today, 08:00 AM', description: 'Attendance captured for the morning shift.', icon: 'check', color: '#0053da' },
      { title: 'Advance Added', time: 'Yesterday', description: '₹2,000 advance recorded.', icon: 'payments', color: '#006a66' },
    ],
    payments: [{ title: 'Weekly Advance', ref: '#TXN-009322', date: '17 May 2026', amount: '₹2,000.00' }],
  },
};

class DemoDatabase {
  private listeners = new Set<Listener>();
  private laborers: Laborer[] = seedLaborers.map((item) => ({ ...item }));
  private profiles: Record<string, LaborProfile> = Object.fromEntries(
    Object.entries(seedProfiles).map(([key, profile]) => [key, cloneProfile(profile)])
  );
  private cashbookRows: CashbookRow[] = [
    { day: '01', weekday: 'Fri', attendance: ['A', 'P', 'OT'] },
    { day: '02', weekday: 'Sat', attendance: ['A', 'P', 'OT'], amount: '₹18,000' },
    { day: '03', weekday: 'Sun', attendance: ['A', 'P', 'OT'], amount: '₹12,400' },
    { day: '04', weekday: 'Mon', attendance: ['A', 'P', 'OT'], amount: '₹8,000' },
    { day: '05', weekday: 'Tue', attendance: ['P', 'OT'], amount: '₹24,000', highlighted: true },
    { day: '06', weekday: 'Wed', attendance: ['A', 'P', 'OT'] },
    { day: '07', weekday: 'Thu', attendance: ['A', 'P', 'OT'], amount: '₹6,400' },
  ];
  private notifications: NotificationRecord[] = [
    { id: 'payment-reminder', title: 'Payment reminder', desc: 'Rajesh Kumar has a pending amount of ₹12,400.', color: '#bb1712', read: false },
    { id: 'attendance-updated', title: 'Attendance updated', desc: '18 laborers are marked present today.', color: '#006a66', read: false },
    { id: 'backup-completed', title: 'Backup completed', desc: 'Your data backup finished successfully a few minutes ago.', color: '#00531e', read: true },
  ];
  private settings: SettingsRecord = { mode: 'light', notificationsEnabled: true };

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private emit() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  getLaborers() {
    return this.laborers;
  }

  getProfiles() {
    return this.profiles;
  }

  getLaborProfile(id?: string) {
    if (!id) return this.profiles.gaurav;
    const normalizedId = slugify(id);
    return this.profiles[normalizedId] ?? this.buildProfileFromLaborer(this.laborers.find((item) => item.slug === normalizedId));
  }

  getCashbookRows() {
    return this.cashbookRows;
  }

  getNotifications() {
    return this.notifications;
  }

  getSettings() {
    return this.settings;
  }

  updateLabor(
    slug: string,
    patch: Partial<Pick<Laborer, 'name' | 'role' | 'amount' | 'status' | 'badge' | 'badgeBg' | 'badgeText' | 'phone' | 'muted'>> & {
      notes?: string;
    }
  ) {
    const normalizedSlug = slugify(slug);
    let updated = false;

    this.laborers = this.laborers.map((laborer) => {
      if (laborer.slug !== normalizedSlug) {
        return laborer;
      }

      updated = true;
      return {
        ...laborer,
        ...patch,
      };
    });

    if (updated && this.profiles[normalizedSlug]) {
      const profile = this.profiles[normalizedSlug];
      this.profiles = {
        ...this.profiles,
        [normalizedSlug]: {
          ...profile,
          name: patch.name ?? profile.name,
          role: patch.role ?? profile.role,
          dailyRate: patch.amount ?? profile.dailyRate,
          duesNote: patch.notes ?? profile.duesNote,
        },
      };
    }

    if (updated) {
      this.notifications = [
        {
          id: `edit-${normalizedSlug}-${Date.now()}`,
          title: 'Labor updated',
          desc: `${patch.name ?? normalizedSlug} was updated in the demo database.`,
          color: '#006a66',
          read: false,
        },
        ...this.notifications,
      ];
      this.emit();
    }

    return updated;
  }

  markLaborPresent(slug: string) {
    return this.updateLabor(slug, { status: 'Present', muted: false });
  }

  addCashbookRow(row: CashbookRow) {
    this.cashbookRows = [row, ...this.cashbookRows];
    this.notifications = [
      {
        id: `cashbook-${row.day}-${row.weekday}-${Date.now()}`,
        title: 'Cashbook updated',
        desc: `Added a cashbook row for ${row.weekday}.`,
        color: '#0053da',
        read: false,
      },
      ...this.notifications,
    ];
    this.emit();
  }

  setMode(mode: SettingsRecord['mode']) {
    this.settings = { ...this.settings, mode };
    this.emit();
  }

  toggleNotifications() {
    this.settings = { ...this.settings, notificationsEnabled: !this.settings.notificationsEnabled };
    this.emit();
  }

  createLabor(input: CreateLaborInput) {
    const name = input.name.trim();
    const slug = slugify(name);
    const parsedAmount = parseRupees(input.amount);
    const amountValue = Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : input.salaryMode === 'daily' ? 650 : 15600;
    const laborer: Laborer = {
      slug,
      initials: getInitials(name),
      name,
      role: input.entryMode === 'contacts' ? 'Imported Worker' : 'General Worker',
      status: 'Present',
      amount: formatRupees(amountValue),
      amountColor: '#005bbf',
      badge: 'New',
      badgeBg: '#e7eefc',
      badgeText: '#005bbf',
    };

    this.laborers = [laborer, ...this.laborers];
    this.profiles = {
      ...this.profiles,
      [slug]: {
        id: slug,
        name,
        role: laborer.role,
        dailyRate: formatRupees(amountValue, 2),
        joinedDate: 'Today',
        workSites: 'Demo Site',
        pendingDues: '₹0.00',
        duesNote: input.notes?.trim() || 'Created from the demo database.',
        attendance: { present: 1, absent: 0, upcoming: 0 },
        activity: [
          {
            title: 'Labor Added',
            time: 'Just now',
            description: `Added from ${input.entryMode === 'contacts' ? 'contacts' : 'manual'} entry.`,
            icon: 'person_add',
            color: '#0053da',
          },
        ],
        payments: [],
      },
    };

    this.notifications = [
      { id: `labor-${slug}`, title: 'Labor added', desc: `${name} was added to the demo database.`, color: '#0053da', read: false },
      ...this.notifications,
    ];
    this.emit();
    return laborer;
  }

  getDashboardSummary() {
    const presentToday = this.laborers.filter((item) => item.status === 'Present').length;
    const pendingPayments = this.laborers.reduce((sum, item) => (item.badge === 'Unpaid' ? sum + parseRupees(item.amount) : sum), 0);
    const monthlyExpenses = this.cashbookRows.reduce((sum, item) => sum + parseRupees(item.amount ?? '0'), 0);

    return {
      totalLabor: this.laborers.length,
      presentToday,
      attendanceRate: `${Math.round((presentToday / Math.max(this.laborers.length, 1)) * 100)}%`,
      pendingPayments: formatRupees(pendingPayments),
      monthlyExpenses: formatRupees(monthlyExpenses),
      siteTransfers: Object.values(this.profiles).filter((profile) => profile.activity.some((item: LaborProfile['activity'][number]) => item.title === 'Site Transfer')).length,
      recentLaborers: this.laborers.slice(0, 3),
    };
  }

  getReportMetrics() {
    const dashboard = this.getDashboardSummary();
    const paidThisMonth = this.cashbookRows.reduce((sum, item) => sum + parseRupees(item.amount ?? '0'), 0);
    const pendingDue = Object.values(this.profiles).reduce((sum, profile) => sum + parseRupees(profile.pendingDues), 0);

    return {
      ...dashboard,
      paidThisMonth: formatRupees(paidThisMonth),
      pendingDue: formatRupees(pendingDue),
    };
  }

  buildProfileFromLaborer(laborer?: Laborer) {
    if (!laborer) return this.profiles.gaurav;

    return {
      id: laborer.slug,
      name: laborer.name,
      role: laborer.role,
      dailyRate: laborer.amount,
      joinedDate: 'Today',
      workSites: 'Demo Site',
      pendingDues: laborer.badge === 'Unpaid' ? laborer.amount : '₹0.00',
      duesNote: 'Derived from the demo database.',
      attendance: {
        present: laborer.status === 'Present' ? 1 : 0,
        absent: laborer.status === 'Absent' ? 1 : 0,
        upcoming: 0,
      },
      activity: [
        { title: 'Synced from demo database', time: 'Today', description: 'Generated from the local in-app database.', icon: 'check', color: '#0053da' },
      ],
      payments: [],
    };
  }
}

export const demoDatabase = new DemoDatabase();
