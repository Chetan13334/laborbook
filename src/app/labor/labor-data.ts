import { appDatabase as laborDatabase } from '@/database';

export { slugify as toSlug } from '@/database/helpers';

export function getLaborProfile(id?: string) {
  return laborDatabase.labor.getLaborProfile(id);
}

export function getLaborers() {
  return laborDatabase.labor.getLaborers();
}

export function getLaborProfiles() {
  return laborDatabase.labor.getProfiles();
}
