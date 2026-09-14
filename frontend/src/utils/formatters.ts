/**
 * Formats a number into a localized currency string.
 */

// THIS is a prsentation and fotmating file 
export function formatCurrency(amount: number, locale = 'en-IN', currency = 'INR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats an ISO date string into a localized readable date/time string.
 */
export function formatDate(isoDateString: string, locale = 'en-US'): string {
  if (!isoDateString) return '-';
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return isoDateString;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
