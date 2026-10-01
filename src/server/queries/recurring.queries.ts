import 'server-only';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function getRecurringTransactions() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  return db.recurringTransaction.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      account: true,
      category: true,
    },
    orderBy: {
      nextDueDate: 'asc',
    },
  });
}

export async function getRecurringTransaction(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  return db.recurringTransaction.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      account: true,
      category: true,
    },
  });
}
