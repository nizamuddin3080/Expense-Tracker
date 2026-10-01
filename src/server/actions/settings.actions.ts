'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { ActionResult } from '@/types';
import { 
  updateProfileSchema, 
  changePasswordSchema,
  UpdateProfileInput,
  ChangePasswordInput 
} from '@/lib/validators';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(data: UpdateProfileInput): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = updateProfileSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: 'Invalid fields', fieldErrors: validatedData.error.flatten().fieldErrors };
    }

    const { name, email } = validatedData.data;

    // Check if email is taken by another user
    const existingUser = await db.user.findFirst({
      where: {
        email,
        id: { not: session.user.id }
      }
    });

    if (existingUser) {
      return { success: false, error: 'Email already in use' };
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { name, email }
    });

    revalidatePath('/settings');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function changePasswordAction(data: ChangePasswordInput): Promise<ActionResult<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const validatedData = changePasswordSchema.safeParse(data);
    if (!validatedData.success) {
      return { success: false, error: 'Invalid fields', fieldErrors: validatedData.error.flatten().fieldErrors };
    }

    const { currentPassword, newPassword } = validatedData.data;

    const user = await db.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: 'Incorrect current password' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { id: session.user.id },
      data: { passwordHash }
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Failed to change password' };
  }
}
