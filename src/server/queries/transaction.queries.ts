import { auth } from '@/auth';
import { db } from '@/lib/db';
import { TransactionFilters, PaginatedResult, TransactionWithRelations } from '@/types';
import { Prisma } from '@prisma/client';

export async function getTransactions(
  filters: TransactionFilters,
  page = 1,
  limit = 20
): Promise<PaginatedResult<TransactionWithRelations>> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const where: Prisma.TransactionWhereInput = {
    userId: session.user.id,
    isDeleted: false,
  };

  if (filters.type) where.type = filters.type;
  if (filters.accountId) {
    where.OR = [
      { accountId: filters.accountId },
      { toAccountId: filters.accountId }
    ];
  }
  if (filters.categoryId) where.categoryId = filters.categoryId;
  
  if (filters.search) {
    where.AND = [
      ...(where.AND ? (Array.isArray(where.AND) ? where.AND : [where.AND]) : []),
      {
        OR: [
          { merchant: { contains: filters.search } },
          { note: { contains: filters.search } },
        ]
      }
    ];
  }

  const skip = (page - 1) * limit;

  const [items, totalCount] = await Promise.all([
    db.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      skip,
      take: limit,
      include: {
        account: true,
        toAccount: true,
        category: true,
        subcategory: true,
        tags: { include: { tag: true } },
        attachments: true,
      },
    }),
    db.transaction.count({ where }),
  ]);

  return {
    items,
    totalCount,
    nextCursor: items.length === limit ? String(page + 1) : null,
  };
}

export async function getTransaction(id: string): Promise<TransactionWithRelations | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  return db.transaction.findUnique({
    where: {
      id,
      userId: session.user.id,
      isDeleted: false,
    },
    include: {
      account: true,
      toAccount: true,
      category: true,
      subcategory: true,
      tags: { include: { tag: true } },
      attachments: true,
    },
  });
}
