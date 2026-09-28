import { auth } from '@/auth';
import { db } from '@/lib/db';
import { AccountWithBalance } from '@/types';

/**
 * Get all accounts for the currently logged-in user.
 * Currently maps openingBalance to currentBalance until transactions are implemented.
 */
export async function getAccounts(): Promise<AccountWithBalance[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const accounts = await db.account.findMany({
    where: {
      userId: session.user.id,
      isActive: true, // Assuming we only want active accounts by default
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  return accounts.map((account) => ({
    ...account,
    currentBalance: account.openingBalance,
  }));
}

/**
 * Get a single account by ID for the logged-in user.
 */
export async function getAccount(id: string): Promise<AccountWithBalance | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const account = await db.account.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!account) {
    return null;
  }

  return {
    ...account,
    currentBalance: account.openingBalance,
  };
}
