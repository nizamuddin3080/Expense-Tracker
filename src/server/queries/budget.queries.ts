import 'server-only';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { BudgetWithSpent } from '@/types';
import { toDecimal, subtractMoney, percentOf, moneyToString } from '@/lib/money';

export async function getBudgets(month?: number, year?: number): Promise<BudgetWithSpent[]> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  const userId = session.user.id;

  const now = new Date();
  const targetMonth = month ?? (now.getMonth() + 1);
  const targetYear = year ?? now.getFullYear();

  const budgets = await db.budget.findMany({
    where: {
      userId,
      month: targetMonth,
      year: targetYear,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
  const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

  const expenses = await db.transaction.groupBy({
    by: ['categoryId'],
    where: {
      userId,
      type: 'EXPENSE',
      isDeleted: false,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const expenseMap = new Map<string, string>();
  for (const exp of expenses) {
    if (exp.categoryId && exp._sum.amount) {
      expenseMap.set(exp.categoryId, exp._sum.amount.toString());
    }
  }

  return budgets.map((budget) => {
    const amountDec = toDecimal(budget.amount);
    const spentStr = expenseMap.get(budget.categoryId) || '0';
    const spentDec = toDecimal(spentStr);
    
    let remainingDec = subtractMoney(amountDec, spentDec);
    if (remainingDec.isNegative()) {
      remainingDec = toDecimal('0');
    }

    const percentage = percentOf(spentDec, amountDec).toNumber();

    return {
      id: budget.id,
      categoryId: budget.categoryId,
      categoryName: budget.category.name,
      categoryIcon: budget.category.icon,
      amount: moneyToString(amountDec),
      spent: moneyToString(spentDec),
      remaining: moneyToString(remainingDec),
      percentage,
      month: budget.month,
      year: budget.year,
    };
  });
}
