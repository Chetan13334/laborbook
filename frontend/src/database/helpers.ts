export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getInitials(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}

export function parseRupees(value: string) {
  const numericValue = Number(value.replace(/[^\d.-]/g, ''));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function formatRupees(value: number, decimals = 0) {
  const formatter = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `₹${formatter.format(value)}`;
}
