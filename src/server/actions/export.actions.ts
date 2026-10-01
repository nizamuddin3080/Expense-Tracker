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
