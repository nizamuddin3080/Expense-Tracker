import { Prisma } from '@prisma/client';

// ---- Enums (mirror Prisma but available on client) ----
export enum TransactionType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
  TRANSFER = 'TRANSFER',
}

export enum AccountType {
  CASH = 'CASH',
  BANK = 'BANK',
  MOBILE_BANKING = 'MOBILE_BANKING',
  CREDIT_CARD = 'CREDIT_CARD',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  OTHER = 'OTHER',
}

export enum CategoryType {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

export enum NotificationType {
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  BUDGET_WARNING = 'BUDGET_WARNING',
  RECURRING_UPCOMING = 'RECURRING_UPCOMING',
  GOAL_MILESTONE = 'GOAL_MILESTONE',
}

// ---- Server Action Result Type ----
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ---- Account with computed balance ----
export type AccountWithBalance = Prisma.AccountGetPayload<{}> & {
  currentBalance: Prisma.Decimal;
};

// ---- Transaction with relations ----
export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    account: true;
    toAccount: true;
    category: true;
    subcategory: true;
    tags: { include: { tag: true } };
    attachments: true;
  };
}>;

// ---- Category with subcategories ----
export type CategoryWithSubcategories = Prisma.CategoryGetPayload<{
  include: { subcategories: true };
}>;

// ---- Dashboard summary ----
export interface DashboardSummary {
  totalBalance: string;
  monthlyIncome: string;
  monthlyExpense: string;
  netCashFlow: string;
  savingsRate: number;
  todaySpending: string;
}

// ---- Budget with spent ----
export interface BudgetWithSpent {
  id: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  amount: string;
  spent: string;
  remaining: string;
  percentage: number;
  month: number;
  year: number;
}

// ---- Pagination ----
export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  totalCount: number;
}

// ---- Transaction Filters ----
export interface TransactionFilters {
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  merchant?: string;
  tags?: string[];
  search?: string;
  isDeleted?: boolean;
}
