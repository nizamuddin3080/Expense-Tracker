'use server';

import { db } from '@/lib/db';
import { auth } from '@/auth';
import { ActionResult } from '@/types';
import { CreateBudgetInput, createBudgetSchema } from '@/lib/validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

export async function createBudgetAction(data: CreateBudgetInput): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = createBudgetSchema.parse(data);

    const budget = await db.budget.create({
      data: {
        userId: session.user.id,
        categoryId: validatedData.categoryId,
        amount: validatedData.amount,
        month: validatedData.month,
        year: validatedData.year,
      },
    });

    revalidatePath('/budgets');
    return { success: true, data: budget };
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: 'A budget for this category in the selected month already exists.' };
      }
    }
    if (error.name === 'ZodError') {
      return { success: false, error: 'Validation failed', fieldErrors: error.flatten().fieldErrors };
    }
    return { success: false, error: error.message || 'Failed to create budget' };
  }
}

export async function updateBudgetAction(data: { id: string; amount: string }): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // Verify ownership
    const existing = await db.budget.findUnique({ where: { id: data.id } });
    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: 'Budget not found or unauthorized' };
    }

    if (!data.amount || isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
      return { success: false, error: 'Invalid amount' };
    }

    const budget = await db.budget.update({
      where: { id: data.id },
      data: { amount: data.amount },
    });

    revalidatePath('/budgets');
    return { success: true, data: budget };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update budget' };
  }
}

export async function deleteBudgetAction(id: string): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const existing = await db.budget.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) {
      return { success: false, error: 'Budget not found or unauthorized' };
    }

    await db.budget.delete({ where: { id } });

    revalidatePath('/budgets');
    return { success: true, data: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete budget' };
  }
}
