export function parseRupees(value?: string | number | null) {
  if (value === null || value === undefined) return 0;
  const numeric = Number(String(value).replace(/[^\d.-]/g, ''));
  return Number.isNaN(numeric) ? 0 : numeric;
}
