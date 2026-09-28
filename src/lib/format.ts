import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import Decimal from 'decimal.js';
import { toDecimal } from './money';

const DEFAULT_CURRENCY = 'BDT';
const CURRENCY_SYMBOL = '৳';

/**
 * Format a monetary value for display.
 * Uses comma separators and currency symbol.
 * Example: ৳1,000.00
 */
export function formatCurrency(
  value: string | number | Decimal,
  options?: { showSign?: boolean; currency?: string }
): string {
  const decimal = toDecimal(value);
  const isNeg = decimal.isNegative();
  const absValue = decimal.abs().toFixed(2);

  // Add comma separators
  const [intPart, decPart] = absValue.split('.');
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const symbol = CURRENCY_SYMBOL;
  const sign = isNeg ? '-' : (options?.showSign ? '+' : '');

  return `${sign}${symbol}${formatted}.${decPart}`;
}

/**
 * Format a date for display.
 * Shows "Today", "Yesterday", or the formatted date.
 */
export function formatDate(date: Date | string, pattern: string = 'dd MMM yyyy'): string {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';

  return format(d, pattern);
}

/**
 * Format a date with day of week.
 * Example: "Mon, 29 Sep 2026"
 */
export function formatDateWithDay(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEE, dd MMM yyyy');
}

/**
 * Format relative time.
 * Example: "2 hours ago", "3 days ago"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Format a date for form inputs (YYYY-MM-DD).
 */
export function formatDateForInput(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
}

/**
 * Format month and year.
 * Example: "September 2026"
 */
export function formatMonthYear(month: number, year: number): string {
  const d = new Date(year, month - 1, 1);
  return format(d, 'MMMM yyyy');
}

/**
 * Format a percentage.
 * Example: "85.5%"
 */
export function formatPercentage(value: number | Decimal, decimals: number = 1): string {
  const num = value instanceof Decimal ? value.toNumber() : value;
  return `${num.toFixed(decimals)}%`;
}

/**
 * Format a number with comma separators.
 */
export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}
