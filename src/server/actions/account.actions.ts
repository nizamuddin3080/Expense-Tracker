'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { createAccountSchema, updateAccountSchema, CreateAccountInput, UpdateAccountInput } from '@/lib/validators';
import { ActionResult } from '@/types';
import { Prisma } from '@prisma/client';

export async function createAccountAction(data: CreateAccountInput): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = createAccountSchema.safeParse(data);
    if (!validatedData.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const [key, value] of Object.entries(validatedData.error.flatten().fieldErrors)) {
        if (value) {
          fieldErrors[key] = value as string[];
        }
      }
      return { success: false, error: 'Validation failed', fieldErrors };
    }

    const { name, type, openingBalance, currency, icon } = validatedData.data;

    // Get max sort order to append new account at the end
    const lastAccount = await db.account.findFirst({
      where: { userId: session.user.id },
      orderBy: { sortOrder: 'desc' },
    });
    
    const sortOrder = lastAccount ? lastAccount.sortOrder + 1 : 0;

    const account = await db.account.create({
      data: {
        userId: session.user.id,
        name,
        type,
        openingBalance: new Prisma.Decimal(openingBalance),
        currency: currency || 'BDT',
        icon,
        sortOrder,
      },
    });

    revalidatePath('/accounts');
    
    // We can't return Decimal objects to the client in server actions easily,
    // so we can just return success true
    return { success: true, data: { id: account.id } };
  } catch (error) {
    console.error('Failed to create account:', error);
    return { success: false, error: 'Failed to create account. Please try again.' };
  }
}

export async function updateAccountAction(data: UpdateAccountInput): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = updateAccountSchema.safeParse(data);
    if (!validatedData.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const [key, value] of Object.entries(validatedData.error.flatten().fieldErrors)) {
        if (value) {
          fieldErrors[key] = value as string[];
        }
      }
      return { success: false, error: 'Validation failed', fieldErrors };
    }

    const { id, name, type, openingBalance, currency, icon, isActive } = validatedData.data;

    // Check if account belongs to user
    const existingAccount = await db.account.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!existingAccount) {
      return { success: false, error: 'Account not found' };
    }

    const account = await db.account.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(openingBalance && { openingBalance: new Prisma.Decimal(openingBalance) }),
        ...(currency && { currency }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    revalidatePath('/accounts');
    return { success: true, data: { id: account.id } };
  } catch (error) {
    console.error('Failed to update account:', error);
    return { success: false, error: 'Failed to update account. Please try again.' };
  }
}

export async function deleteAccountAction(id: string): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const existingAccount = await db.account.findUnique({
      where: { id, userId: session.user.id },
      include: {
        _count: {
          select: { transactions: true } // Assuming transactions relation exists. Let's check or just deactivate
        }
      }
    });

    if (!existingAccount) {
      return { success: false, error: 'Account not found' };
    }

    // Since deleting an account with transactions might violate foreign keys (or cascade),
    // and financial data shouldn't usually be deleted, let's deactivate it if it has transactions.
    
    // Actually, looking at the schema:
    // transactions: account @relation("SourceAccount", onDelete: Restrict)
    // So we can't delete it if there are transactions.
    
    // Instead of querying _count which might fail if not in schema, let's just use try/catch 
    // or just deactivate.
    
    try {
      await db.account.delete({
        where: { id },
      });
    } catch (e: any) {
      if (e.code === 'P2003') { // Foreign key constraint failed
        await db.account.update({
          where: { id },
          data: { isActive: false },
        });
      } else {
        throw e;
      }
    }

    revalidatePath('/accounts');
    return { success: true, data: null };
  } catch (error) {
    console.error('Failed to delete account:', error);
    return { success: false, error: 'Failed to delete account. Please try again.' };
  }
}
