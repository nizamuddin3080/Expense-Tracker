'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { createGoalSchema, CreateGoalInput, goalTransactionSchema, GoalTransactionInput } from '@/lib/validators';
import { revalidatePath } from 'next/cache';
import { addMoney, toDecimal, compareMoney } from '@/lib/money';
import { parseISO } from 'date-fns';

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export async function createGoalAction(data: CreateGoalInput): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const parsed = createGoalSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: Object.values(parsed.error.flatten().fieldErrors).flat()[0] || 'Validation error' };
    }

    const val = parsed.data;
    
    const goal = await db.savingsGoal.create({
      data: {
        userId: session.user!.id,
        name: val.name,
        targetAmount: toDecimal(val.targetAmount),
        targetDate: val.targetDate ? parseISO(val.targetDate) : null,
        icon: val.icon,
        color: val.color,
      },
    });

    revalidatePath('/goals');
    return { success: true, data: goal };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to create goal' };
  }
}

export async function updateGoalAction(id: string, data: any): Promise<ActionResult<any>> {
  return { success: false, error: 'Not implemented' };
}

export async function deleteGoalAction(id: string): Promise<ActionResult<boolean>> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    await db.savingsGoal.delete({
      where: { id, userId: session.user!.id },
    });

    revalidatePath('/goals');
    return { success: true, data: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete goal' };
  }
}

export async function addGoalTransactionAction(data: GoalTransactionInput): Promise<ActionResult<any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const parsed = goalTransactionSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: Object.values(parsed.error.flatten().fieldErrors).flat()[0] || 'Validation error' };
    }

    const val = parsed.data;

    // We must execute this in a transaction to ensure atomic updates
    const result = await db.$transaction(async (tx) => {
      const goal = await tx.savingsGoal.findUnique({
        where: { id: val.goalId, userId: session.user!.id },
      });

      if (!goal) throw new Error('Goal not found');

      // Add transaction
      const transaction = await tx.goalTransaction.create({
        data: {
          goalId: val.goalId,
          amount: toDecimal(val.amount),
          note: val.note,
          date: parseISO(val.date),
        },
      });

      // Update goal currentAmount
      const newAmount = addMoney(goal.currentAmount, val.amount);
      const isCompleted = compareMoney(newAmount, goal.targetAmount) >= 0;
      
      const updatedGoal = await tx.savingsGoal.update({
        where: { id: goal.id },
        data: {
          currentAmount: newAmount,
          isCompleted: isCompleted,
          completedAt: isCompleted && !goal.isCompleted ? new Date() : goal.completedAt,
        },
      });

      return updatedGoal;
    });

    revalidatePath('/goals');
    revalidatePath(`/goals/${val.goalId}`);
    return { success: true, data: result };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Failed to add funds' };
  }
}
