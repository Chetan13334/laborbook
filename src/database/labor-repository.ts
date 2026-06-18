import type { CreateLaborInput, LaborProfile as LaborProfileRecord, Laborer as LaborerRecord } from '@/database';
import { formatRupees, getInitials, slugify } from './helpers';
import { ObservableStore } from './store';

const seedProfiles: Record<string, LaborProfileRecord> = {
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

const seedLaborers: LaborerRecord[] = [
  { slug: 'rajesh-kumar', initials: 'RK', name: 'Rajesh Kumar', role: 'Mason', status: 'Present', amount: '₹450', amountColor: '#bb1712', badge: 'Unpaid', badgeBg: '#ba1a1a1a', badgeText: '#ba1a1a' },
  { slug: 'manoj-singh', initials: 'MS', name: 'Manoj Singh', role: 'Helper', status: 'Present', amount: '₹300', amountColor: '#006e2a', badge: 'Paid', badgeBg: '#8ffa9b33', badgeText: '#00531e' },
  { slug: 'amit-patel', initials: 'AP', name: 'Amit Patel', role: 'Electrician', status: 'Absent', amount: '₹0', amountColor: '#414754', muted: true },
  { slug: 'suresh-tiwari', initials: 'ST', name: 'Suresh Tiwari', role: 'Carpenter', status: 'Present', amount: '₹600', amountColor: '#bb1712', badge: 'Unpaid', badgeBg: '#ba1a1a1a', badgeText: '#ba1a1a' },
  { slug: 'vikram-k', initials: 'VK', name: 'Vikram K.', role: 'Painter', status: 'Present', amount: '₹350', amountColor: '#006e2a', badge: 'Paid', badgeBg: '#8ffa9b33', badgeText: '#00531e' },
];

export class LaborRepository extends ObservableStore {
  private laborers = seedLaborers;
  private profiles = seedProfiles;

  getLaborers() {
    return this.laborers;
  }

  getProfiles() {
    return this.profiles;
  }

  getLaborProfile(id?: string) {
    const slug = id ? slugify(id) : 'gaurav';
    return this.profiles[slug] ?? this.profiles.gaurav;
  }

  createLabor(input: CreateLaborInput) {
    const name = input.name.trim();
    const slug = slugify(name);
    const wage = Number(input.amount.replace(/[^\d.-]/g, '')) || (input.salaryMode === 'daily' ? 450 : 18000);
    const laborer: LaborerRecord = {
      slug,
      initials: getInitials(name),
      name,
      role: input.role?.trim() || (input.entryMode === 'contacts' ? 'Imported Worker' : 'General Worker'),
      status: 'Present',
      amount: formatRupees(wage),
      amountColor: '#005bbf',
      badge: 'New',
      badgeBg: '#e7eefc',
      badgeText: '#005bbf',
      phone: input.phone?.trim() || undefined,
    };

    this.laborers = [laborer, ...this.laborers];
    this.profiles = {
      ...this.profiles,
      [slug]: {
        id: slug,
        name,
        role: laborer.role,
        dailyRate: formatRupees(wage, 2),
        joinedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        workSites: 'Demo Site',
        pendingDues: formatRupees(0, 2),
        duesNote: input.notes?.trim() || 'Created from the demo database panel.',
        attendance: { present: 1, absent: 0, upcoming: 0 },
        activity: [
          { title: 'Labor Added', time: 'Just now', description: `Added from ${input.entryMode} entry.`, icon: 'person_add', color: '#0053da' },
        ],
        payments: [],
        notes: input.notes?.trim() || undefined,
      },
    };

    this.emitChange();
    return laborer;
  }

  updateLabor(slug: string, patch: Partial<Pick<LaborerRecord, 'name' | 'role' | 'amount' | 'status' | 'badge' | 'badgeBg' | 'badgeText' | 'phone' | 'muted'>>) {
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

    if (updated) {
      const profile = this.profiles[normalizedSlug];
      if (profile) {
        this.profiles = {
          ...this.profiles,
          [normalizedSlug]: {
            ...profile,
            name: patch.name ?? profile.name,
            role: patch.role ?? profile.role,
            dailyRate: patch.amount ?? profile.dailyRate,
            duesNote: patch.name || patch.role || patch.amount ? `Updated on ${new Date().toLocaleDateString('en-IN')}.` : profile.duesNote,
          },
        };
      }

      this.emitChange();
    }

    return updated;
  }

  markPresent(slug: string) {
    return this.updateLabor(slug, { status: 'Present', muted: false });
  }
}
