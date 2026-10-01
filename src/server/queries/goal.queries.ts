import 'server-only';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { percentOf } from '@/lib/money';

export async function getGoals() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const goals = await db.savingsGoal.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return goals.map((goal) => ({
    ...goal,
    percentage: percentOf(goal.currentAmount, goal.targetAmount).toNumber(),
  }));
}

export async function getGoal(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const goal = await db.savingsGoal.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      transactions: {
        orderBy: {
          date: 'desc',
        },
      },
    },
  });

  if (!goal) return null;

  return {
    ...goal,
    percentage: percentOf(goal.currentAmount, goal.targetAmount).toNumber(),
  };
}
