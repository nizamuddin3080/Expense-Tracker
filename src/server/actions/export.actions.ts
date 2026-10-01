'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { ActionResult } from '@/types';
import { format } from 'date-fns';

export async function exportTransactionsCSV(): Promise<ActionResult<string>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: session.user.id,
        isDeleted: false,
      },
      include: {
        account: true,
        category: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // CSV Header
    const headers = ['Date', 'Type', 'Amount', 'Account', 'Category', 'Merchant', 'Note'];
    
    // CSV Rows
    const rows = transactions.map((tx) => {
      return [
        format(new Date(tx.date), 'yyyy-MM-dd'),
        tx.type,
        tx.amount.toString(),
        tx.account.name,
        tx.category?.name || 'Uncategorized',
        tx.merchant || '',
        tx.note || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    return { success: true, data: csvContent };
  } catch (error) {
    console.error('Export error:', error);
    return { success: false, error: 'Failed to export transactions' };
  }
}

export async function exportFullBackupJSON(): Promise<ActionResult<string>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = session.user.id;

    const [
      accounts,
      categories,
      transactions,
      budgets,
      recurringTxs,
      goals,
    ] = await Promise.all([
      db.account.findMany({ where: { userId } }),
      db.category.findMany({ where: { userId } }),
      db.transaction.findMany({ where: { userId, isDeleted: false } }),
      db.budget.findMany({ where: { userId } }),
      db.recurringTransaction.findMany({ where: { userId } }),
      db.savingsGoal.findMany({ where: { userId } }),
    ]);

    const backupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        accounts,
        categories,
        transactions,
        budgets,
        recurringTxs,
        goals,
      }
    };

    return { success: true, data: JSON.stringify(backupData, null, 2) };
  } catch (error) {
    console.error('Backup error:', error);
    return { success: false, error: 'Failed to create backup' };
  }
}

