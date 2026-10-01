'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { addMoney, subtractMoney, sumMoney, toDecimal, percentOf, isZero, multiplyMoney, divideMoney } from '@/lib/money';
import { startOfMonth, endOfMonth, startOfDay, endOfDay, subMonths, format } from 'date-fns';

export async function getDashboardSummary() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;
  const now = new Date();
  
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  // Get all accounts for total balance
  const accounts = await db.account.findMany({
    where: { userId, isActive: true },
    select: { id: true, openingBalance: true },
  });

  // Get all non-deleted transactions for the user
  const allTxs = await db.transaction.findMany({
    where: { userId, isDeleted: false },
    select: {
      type: true,
      amount: true,
      date: true,
      accountId: true,
      toAccountId: true,
      categoryId: true,
      category: {
        select: {
          name: true,
          icon: true,
        }
      }
    },
  });

  // Calculate total balance
  let totalBalance = sumMoney(accounts.map(a => a.openingBalance));
  for (const tx of allTxs) {
    if (tx.type === 'INCOME') {
      totalBalance = addMoney(totalBalance, tx.amount);
    } else if (tx.type === 'EXPENSE') {
      totalBalance = subtractMoney(totalBalance, tx.amount);
    }
    // Transfer does not change total balance unless it goes to an untracked account, but we assume both accounts are in the user's list.
  }

  // Current month stats
  let monthlyIncome = toDecimal(0);
  let monthlyExpense = toDecimal(0);
  let todaySpending = toDecimal(0);
  
  const categorySpendingMap = new Map<string, { amount: ReturnType<typeof toDecimal>, name: string, icon: string | null }>();

  for (const tx of allTxs) {
    const isCurrentMonth = tx.date >= currentMonthStart && tx.date <= currentMonthEnd;
    const isToday = tx.date >= todayStart && tx.date <= todayEnd;

    if (tx.type === 'INCOME' && isCurrentMonth) {
      monthlyIncome = addMoney(monthlyIncome, tx.amount);
    }

    if (tx.type === 'EXPENSE') {
      if (isCurrentMonth) {
        monthlyExpense = addMoney(monthlyExpense, tx.amount);
        
        // Group by category
        if (tx.categoryId && tx.category) {
          const catId = tx.categoryId;
          const existing = categorySpendingMap.get(catId);
          if (existing) {
            existing.amount = addMoney(existing.amount, tx.amount);
          } else {
            categorySpendingMap.set(catId, {
              amount: toDecimal(tx.amount),
              name: tx.category.name,
              icon: tx.category.icon
            });
          }
        }
      }
      if (isToday) {
        todaySpending = addMoney(todaySpending, tx.amount);
      }
    }
  }

  const netCashFlow = subtractMoney(monthlyIncome, monthlyExpense);
  const savingsRate = isZero(monthlyIncome) ? 0 : percentOf(netCashFlow, monthlyIncome).toNumber();

  // Spending by category format
  const spendingByCategory = Array.from(categorySpendingMap.values())
    .map(c => ({
      categoryName: c.name,
      categoryIcon: c.icon,
      amount: c.amount.toString(),
      percentage: isZero(monthlyExpense) ? 0 : percentOf(c.amount, monthlyExpense).toNumber(),
    }))
    .sort((a, b) => Number(b.amount) - Number(a.amount)); // Sort by amount desc

  // Recent transactions
  const recentTransactions = await db.transaction.findMany({
    where: { userId, isDeleted: false },
    orderBy: { date: 'desc' },
    take: 5,
    include: {
      account: true,
      category: true,
      toAccount: true,
    }
  });

  // 6-Month Trend
  const monthlyTrendMap = new Map<string, { income: ReturnType<typeof toDecimal>, expense: ReturnType<typeof toDecimal> }>();
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i);
    const label = format(d, 'MMM yyyy');
    monthlyTrendMap.set(label, { income: toDecimal(0), expense: toDecimal(0) });
  }

  const sixMonthsAgoStart = startOfMonth(subMonths(now, 5));
  for (const tx of allTxs) {
    if (tx.date >= sixMonthsAgoStart && tx.date <= currentMonthEnd) {
      const label = format(tx.date, 'MMM yyyy');
      const data = monthlyTrendMap.get(label);
      if (data) {
        if (tx.type === 'INCOME') data.income = addMoney(data.income, tx.amount);
        if (tx.type === 'EXPENSE') data.expense = addMoney(data.expense, tx.amount);
      }
    }
  }

  const monthlyTrend = Array.from(monthlyTrendMap.entries()).map(([month, data]) => ({
    month,
    income: data.income.toNumber(),
    expense: data.expense.toNumber(),
  }));

  const hasAccounts = accounts.length > 0;

  return {
    totalBalance: totalBalance.toString(),
    monthlyIncome: monthlyIncome.toString(),
    monthlyExpense: monthlyExpense.toString(),
    netCashFlow: netCashFlow.toString(),
    savingsRate,
    todaySpending: todaySpending.toString(),
    recentTransactions,
    spendingByCategory,
    monthlyTrend,
    hasAccounts,
  };
}
