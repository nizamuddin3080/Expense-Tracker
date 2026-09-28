import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', icon: 'UtensilsCrossed', type: 'EXPENSE', subcategories: ['Groceries', 'Restaurants', 'Snacks', 'Coffee'] },
  { name: 'Transportation', icon: 'Car', type: 'EXPENSE', subcategories: ['Fuel', 'Public Transit', 'Ride Share', 'Parking'] },
  { name: 'Housing', icon: 'Home', type: 'EXPENSE', subcategories: ['Rent', 'Utilities', 'Maintenance', 'Internet'] },
  { name: 'Shopping', icon: 'ShoppingBag', type: 'EXPENSE', subcategories: ['Clothing', 'Electronics', 'Household', 'Personal Care'] },
  { name: 'Healthcare', icon: 'Heart', type: 'EXPENSE', subcategories: ['Medicine', 'Doctor', 'Insurance'] },
  { name: 'Entertainment', icon: 'Film', type: 'EXPENSE', subcategories: ['Movies', 'Games', 'Subscriptions', 'Books'] },
  { name: 'Education', icon: 'GraduationCap', type: 'EXPENSE', subcategories: ['Courses', 'Books', 'Supplies'] },
  { name: 'Personal', icon: 'User', type: 'EXPENSE', subcategories: ['Gifts', 'Donations', 'Self-care'] },
  { name: 'Financial', icon: 'Landmark', type: 'EXPENSE', subcategories: ['Bank Fees', 'Interest', 'Tax'] },
  { name: 'Other Expense', icon: 'MoreHorizontal', type: 'EXPENSE', subcategories: ['Miscellaneous'] },
];

const INCOME_CATEGORIES = [
  { name: 'Salary', icon: 'Briefcase', type: 'INCOME' },
  { name: 'Freelance', icon: 'Laptop', type: 'INCOME' },
  { name: 'Investment', icon: 'TrendingUp', type: 'INCOME' },
  { name: 'Gift', icon: 'Gift', type: 'INCOME' },
  { name: 'Refund', icon: 'RotateCcw', type: 'INCOME' },
  { name: 'Other Income', icon: 'Plus', type: 'INCOME' },
];

async function main() {
  console.log('Seeding default categories...');

  let sortOrderExp = 0;
  for (const cat of EXPENSE_CATEGORIES) {
    let parent = await prisma.category.findFirst({
      where: { name: cat.name, type: cat.type, userId: null },
    });

    if (!parent) {
      parent = await prisma.category.create({
        data: {
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          isDefault: true,
          sortOrder: sortOrderExp++,
        },
      });
    }

    if (cat.subcategories) {
      let subSort = 0;
      for (const sub of cat.subcategories) {
        const existingSub = await prisma.category.findFirst({
          where: { name: sub, type: cat.type, parentId: parent.id, userId: null },
        });

        if (!existingSub) {
          await prisma.category.create({
            data: {
              name: sub,
              type: cat.type,
              isDefault: true,
              parentId: parent.id,
              sortOrder: subSort++,
            },
          });
        }
      }
    }
  }

  let sortOrderInc = 0;
  for (const cat of INCOME_CATEGORIES) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name, type: cat.type, userId: null },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          isDefault: true,
          sortOrder: sortOrderInc++,
        },
      });
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
