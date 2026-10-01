'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { ActionResult } from '@/types';
import { Decimal } from 'decimal.js';

export async function importTransactionsCSV(
  csvContent: string,
  accountId: string
): Promise<ActionResult<{ imported: number; skipped: number; errors: string[] }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = session.user.id;

    const account = await db.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) {
      return { success: false, error: 'Account not found' };
    }

    const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return { success: false, error: 'CSV file is empty or missing data rows' };
    }

    // Attempt to parse headers
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/"/g, ''));
    
    // Find expected columns (Date, Type, Amount, Merchant, Note)
    const dateIdx = headers.findIndex((h) => h.includes('date'));
    const typeIdx = headers.findIndex((h) => h.includes('type'));
    const amountIdx = headers.findIndex((h) => h.includes('amount'));
    const merchantIdx = headers.findIndex((h) => h.includes('merchant') || h.includes('payee'));
    const noteIdx = headers.findIndex((h) => h.includes('note') || h.includes('description'));

    if (dateIdx === -1 || amountIdx === -1) {
      return { success: false, error: 'CSV must contain at least Date and Amount columns' };
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Process rows
    for (let i = 1; i < lines.length; i++) {
      const rowStr = lines[i];
      // Basic CSV splitting, not handling escaped quotes perfectly but good enough for a simple import
      // A full regex for CSV can be used if needed:
      const row = rowStr.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(val => val.replace(/(^"|"$)/g, '').trim()) || rowStr.split(',').map(s => s.trim());
      
      const dateStr = row[dateIdx];
      const amountStr = row[amountIdx];
      const typeStr = typeIdx !== -1 && row[typeIdx] ? row[typeIdx].toLowerCase() : '';
      const merchant = merchantIdx !== -1 ? row[merchantIdx] : undefined;
      const note = noteIdx !== -1 ? row[noteIdx] : undefined;

      if (!dateStr || !amountStr) {
        skipped++;
        errors.push(`Row ${i + 1}: Missing date or amount`);
        continue;
      }

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        skipped++;
        errors.push(`Row ${i + 1}: Invalid date format`);
        continue;
      }

      let amountVal: Decimal;
      try {
        amountVal = new Decimal(amountStr.replace(/[^0-9.-]+/g, ''));
      } catch (e) {
        skipped++;
        errors.push(`Row ${i + 1}: Invalid amount`);
        continue;
      }

      const amount = amountVal.abs();
      let type = 'EXPENSE';
      if (typeStr === 'income' || amountVal.isNegative() === false && typeStr !== 'expense') {
        type = amountVal.isNegative() ? 'EXPENSE' : 'INCOME';
      } else if (typeStr === 'expense' || amountVal.isNegative()) {
        type = 'EXPENSE';
      }

      // Check for duplicate
      const existing = await db.transaction.findFirst({
        where: {
          userId,
          accountId,
          date,
          amount,
          merchant: merchant || null,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      try {
        await db.transaction.create({
          data: {
            userId,
            accountId,
            type,
            amount,
            date,
            merchant,
            note,
          },
        });
        imported++;
      } catch (err) {
        skipped++;
        errors.push(`Row ${i + 1}: Failed to save transaction`);
      }
    }

    return { success: true, data: { imported, skipped, errors } };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, error: 'Failed to import transactions' };
  }
}
