import { AccountType, TransactionType } from '@/types';

// ---- App ----
export const APP_NAME = 'FinTrack';
export const APP_DESCRIPTION = 'Personal Expense Tracker';
export const DEFAULT_CURRENCY = 'BDT';
export const CURRENCY_SYMBOL = '৳';

// ---- Pagination ----
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

// ---- Validation Limits ----
export const MAX_AMOUNT_DIGITS = 15;
export const MAX_DECIMAL_PLACES = 2;
export const MAX_ACCOUNT_NAME_LENGTH = 100;
export const MAX_CATEGORY_NAME_LENGTH = 50;
export const MAX_MERCHANT_LENGTH = 100;
export const MAX_NOTE_LENGTH = 500;
export const MAX_TAG_LENGTH = 30;
export const MAX_TAGS_PER_TRANSACTION = 10;
export const MIN_PASSWORD_LENGTH = 8;

// ---- File Upload ----
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];

// ---- Budget Thresholds ----
export const BUDGET_WARNING_THRESHOLD = 80; // percentage
export const BUDGET_EXCEEDED_THRESHOLD = 100; // percentage

// ---- Account Type Labels ----
export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  [AccountType.CASH]: 'Cash',
  [AccountType.BANK]: 'Bank Account',
  [AccountType.MOBILE_BANKING]: 'Mobile Banking',
  [AccountType.CREDIT_CARD]: 'Credit Card',
  [AccountType.DIGITAL_WALLET]: 'Digital Wallet',
  [AccountType.OTHER]: 'Other',
};

// ---- Account Type Icons ----
export const ACCOUNT_TYPE_ICONS: Record<AccountType, string> = {
  [AccountType.CASH]: 'Banknote',
  [AccountType.BANK]: 'Landmark',
  [AccountType.MOBILE_BANKING]: 'Smartphone',
  [AccountType.CREDIT_CARD]: 'CreditCard',
  [AccountType.DIGITAL_WALLET]: 'Wallet',
  [AccountType.OTHER]: 'CircleDollarSign',
};

// ---- Transaction Type Labels ----
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  [TransactionType.EXPENSE]: 'Expense',
  [TransactionType.INCOME]: 'Income',
  [TransactionType.TRANSFER]: 'Transfer',
};

// ---- Transaction Type Colors (Tailwind classes) ----
export const TRANSACTION_TYPE_COLORS: Record<TransactionType, string> = {
  [TransactionType.EXPENSE]: 'text-red-600 dark:text-red-500',
  [TransactionType.INCOME]: 'text-green-600 dark:text-green-500',
  [TransactionType.TRANSFER]: 'text-blue-600 dark:text-blue-500',
};

// ---- Navigation Items ----
export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Transactions', href: '/transactions', icon: 'ArrowLeftRight' },
  { label: 'Accounts', href: '/accounts', icon: 'Wallet' },
  { label: 'Categories', href: '/categories', icon: 'Grid3X3' },
  { label: 'Budgets', href: '/budgets', icon: 'PieChart' },
  { label: 'Goals', href: '/goals', icon: 'Target' },
  { label: 'Recurring', href: '/recurring', icon: 'Repeat' },
  { label: 'Reports', href: '/reports', icon: 'BarChart3' },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
] as const;

// ---- Mobile Bottom Nav Items ----
export const MOBILE_NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { label: 'Transactions', href: '/transactions', icon: 'ArrowLeftRight' },
  { label: 'Add', href: '#add', icon: 'Plus', isAction: true },
  { label: 'Accounts', href: '/accounts', icon: 'Wallet' },
  { label: 'More', href: '#more', icon: 'Menu', isMenu: true },
] as const;
