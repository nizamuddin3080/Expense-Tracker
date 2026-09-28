'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { createCategorySchema, CreateCategoryInput, updateCategorySchema, UpdateCategoryInput } from '@/lib/validators';
import { ActionResult } from '@/types';
import { Category } from '@prisma/client';

export async function createCategoryAction(data: CreateCategoryInput): Promise<ActionResult<Category>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedFields = createCategorySchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid fields',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const category = await db.category.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
      },
    });

    revalidatePath('/categories');
    return { success: true, data: category };
  } catch (error) {
    console.error('Failed to create category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategoryAction(data: UpdateCategoryInput): Promise<ActionResult<Category>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedFields = updateCategorySchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: 'Invalid fields',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { id, ...updateData } = validatedFields.data;

    // Verify ownership
    const existing = await db.category.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: 'Category not found' };
    }
    if (existing.userId !== session.user.id) {
      return { success: false, error: 'Cannot update system categories or categories belonging to other users' };
    }

    const category = await db.category.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/categories');
    return { success: true, data: category };
  } catch (error) {
    console.error('Failed to update category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult<boolean>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const existing = await db.category.findUnique({ where: { id } });
    
    if (!existing) {
      return { success: false, error: 'Category not found' };
    }
    
    // Cannot delete default categories (userId is null) or another user's category
    if (existing.userId !== session.user.id) {
      return { success: false, error: 'Not authorized to delete this category' };
    }

    await db.category.delete({
      where: { id },
    });

    revalidatePath('/categories');
    return { success: true, data: true };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: 'Failed to delete category. It may be in use.' };
  }
}
