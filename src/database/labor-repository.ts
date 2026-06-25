import type { CreateLaborInput, LaborProfile as LaborProfileRecord, Laborer as LaborerRecord } from '@/database';
import { formatRupees, getInitials, slugify } from './helpers';
import { ObservableStore } from './store';

// LaborRepository used to hold local mock state.
// Supabase is now the source of truth for laborers and profiles.
// This class can be completely removed or refactored to just dispatch actions if needed.
// For now, it's left as a skeleton to avoid breaking other imports that might instantiate it.

export class LaborRepository extends ObservableStore {
  // Mock fallback logic removed.
}
