import 'server-only';
import { db } from '@/lib/db';
import { auth } from '@/auth';

export async function getCategories() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  return db.category.findMany({
    where: {
      OR: [
        { userId: null },
        { userId: session.user.id },
      ],
      parentId: null, // Only fetch top-level categories
    },
    include: {
      subcategories: {
        orderBy: [
          { sortOrder: 'asc' },
          { name: 'asc' },
        ],
      },
    },
    orderBy: [
      { sortOrder: 'asc' },
      { name: 'asc' },
    ],
  });
}

export async function getCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const category = await db.category.findUnique({
    where: { id },
    include: {
      subcategories: true,
    },
  });

  if (!category) {
    return null;
  }

  if (category.userId !== null && category.userId !== session.user.id) {
    return null; // Not authorized to view
  }

  return category;
}
