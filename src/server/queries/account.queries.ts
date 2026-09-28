import { auth } from '@/auth';
import { db } from '@/lib/db';
import { AccountWithBalance } from '@/types';
import { toDecimal, addMoney, subtractMoney } from '@/lib/money';

/**
 * Get all accounts for the currently logged-in user.
 * Calculates currentBalance dynamically.
 */
export async function getAccounts(): Promise<AccountWithBalance[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const accounts = await db.account.findMany({
    where: {
      userId: session.user.id,
      isActive: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  const txs = await db.transaction.findMany({
    where: {
      userId: session.user.id,
      isDeleted: false,
    },
    select: {
      accountId: true,
      toAccountId: true,
      type: true,
      amount: true,
    },
  });

  return accounts.map((account) => {
    let currentBalance = toDecimal(account.openingBalance);
    
    for (const tx of txs) {
      if (tx.accountId === account.id) {
        if (tx.type === 'INCOME') {
          currentBalance = addMoney(currentBalance, tx.amount);
        } else if (tx.type === 'EXPENSE') {
          currentBalance = subtractMoney(currentBalance, tx.amount);
        } else if (tx.type === 'TRANSFER') {
          currentBalance = subtractMoney(currentBalance, tx.amount);
        }
      }
      if (tx.toAccountId === account.id && tx.type === 'TRANSFER') {
        currentBalance = addMoney(currentBalance, tx.amount);
      }
    }

    return {
      ...account,
      currentBalance,
    };
  });
}

/**
 * Get a single account by ID for the logged-in user.
 * Calculates currentBalance dynamically.
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

  const txs = await db.transaction.findMany({
    where: {
      OR: [
        { accountId: id },
        { toAccountId: id }
      ],
      isDeleted: false,
    },
    select: {
      accountId: true,
      toAccountId: true,
      type: true,
      amount: true,
    },
  });

  let currentBalance = toDecimal(account.openingBalance);
  
  for (const tx of txs) {
    if (tx.accountId === account.id) {
      if (tx.type === 'INCOME') {
        currentBalance = addMoney(currentBalance, tx.amount);
      } else if (tx.type === 'EXPENSE') {
        currentBalance = subtractMoney(currentBalance, tx.amount);
      } else if (tx.type === 'TRANSFER') {
        currentBalance = subtractMoney(currentBalance, tx.amount);
      }
    }
    if (tx.toAccountId === account.id && tx.type === 'TRANSFER') {
      currentBalance = addMoney(currentBalance, tx.amount);
    }
  }

  return {
    ...account,
    currentBalance,
  };
}
