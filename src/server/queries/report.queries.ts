'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { toDecimal } from '@/lib/money';
import { subMonths, startOfMonth, format, subDays, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';

export async function getIncomeVsExpenseReport(months: number = 6) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const endDate = new Date();
  const startDate = startOfMonth(subMonths(endDate, months - 1));

  const transactions = await db.transaction.findMany({
    where: {
      userId: session.user.id,
      isDeleted: false,
      type: { in: ['INCOME', 'EXPENSE'] },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      type: true,
      amount: true,
      date: true,
    }
  });

  const monthMap = new Map<string, { income: number; expense: number }>();

  for (let i = months - 1; i >= 0; i--) {
    const d = subMonths(endDate, i);
    monthMap.set(format(d, 'MMM yyyy'), { income: 0, expense: 0 });
  }

  for (const tx of transactions) {
    const monthKey = format(tx.date, 'MMM yyyy');
    if (monthMap.has(monthKey)) {
      const current = monthMap.get(monthKey)!;
      if (tx.type === 'INCOME') {
        current.income = toDecimal(current.income).plus(tx.amount).toNumber();
      } else if (tx.type === 'EXPENSE') {
        current.expense = toDecimal(current.expense).plus(tx.amount).toNumber();
      }
    }
  }

  return Array.from(monthMap.entries()).map(([month, data]) => ({
    month,
    income: data.income,
    expense: data.expense,
  }));
}

export async function getExpenseByCategoryReport(startDate: Date, endDate: Date) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const transactions = await db.transaction.findMany({
    where: {
      userId: session.user.id,
      isDeleted: false,
      type: 'EXPENSE',
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      category: true,
    }
  });

  let totalExpense = toDecimal(0);
  const categoryMap = new Map<string, { name: string, icon: string | null, amount: number }>();

  for (const tx of transactions) {
    const amount = toDecimal(tx.amount);
    totalExpense = totalExpense.plus(amount);

    const catId = tx.categoryId || 'uncategorized';
    const catName = tx.category?.name || 'Uncategorized';
    const catIcon = tx.category?.icon || null;

    if (!categoryMap.has(catId)) {
      categoryMap.set(catId, { name: catName, icon: catIcon, amount: 0 });
    }
    const current = categoryMap.get(catId)!;
    current.amount = toDecimal(current.amount).plus(amount).toNumber();
  }

  const result = Array.from(categoryMap.values()).map(cat => {
    return {
      categoryName: cat.name,
      categoryIcon: cat.icon,
      amount: cat.amount,
      percentage: totalExpense.isZero() ? 0 : toDecimal(cat.amount).dividedBy(totalExpense).times(100).toNumber(),
    };
  });

  return result.sort((a, b) => b.amount - a.amount);
}

export async function getSpendingTrendReport(days: number = 30) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const endDate = new Date();
  const startDate = startOfDay(subDays(endDate, days - 1));

  const transactions = await db.transaction.findMany({
    where: {
      userId: session.user.id,
      isDeleted: false,
      type: 'EXPENSE',
      date: {
        gte: startDate,
        lte: endOfDay(endDate),
      },
    },
    select: {
      amount: true,
      date: true,
    }
  });

  const dailyTotals = new Map<string, number>();
  
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  for (const d of allDays) {
    dailyTotals.set(format(d, 'MMM dd'), 0);
  }

  for (const tx of transactions) {
    const dateKey = format(tx.date, 'MMM dd');
    if (dailyTotals.has(dateKey)) {
      dailyTotals.set(dateKey, toDecimal(dailyTotals.get(dateKey)!).plus(tx.amount).toNumber());
    }
  }

  return Array.from(dailyTotals.entries()).map(([date, amount]) => ({
    date,
    amount,
  }));
}

export async function getAccountBalanceReport() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const accounts = await db.account.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
    },
    select: {
      name: true,
      openingBalance: true,
      type: true,
    }
  });

  return accounts.map(acc => ({
    accountName: acc.name,
    balance: Number(acc.openingBalance),
    type: acc.type,
  }));
}

export async function getTopMerchantsReport(limit: number = 10) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const transactions = await db.transaction.findMany({
    where: {
      userId: session.user.id,
      isDeleted: false,
      type: 'EXPENSE',
      merchant: {
        not: null,
      },
    },
    select: {
      merchant: true,
      amount: true,
    }
  });

  const merchantMap = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.merchant) {
      const current = merchantMap.get(tx.merchant) || 0;
      merchantMap.set(tx.merchant, toDecimal(current).plus(tx.amount).toNumber());
    }
  }

  return Array.from(merchantMap.entries())
    .map(([merchant, amount]) => ({ merchant, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}
