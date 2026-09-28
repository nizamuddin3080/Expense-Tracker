'use server';

import { signIn, signOut } from '@/auth';
import { db } from '@/lib/db';
import { loginSchema, registerSchema, LoginInput, RegisterInput } from '@/lib/validators';
import { ActionResult } from '@/types';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

export async function loginAction(data: LoginInput): Promise<ActionResult<string>> {
  try {
    const validatedData = loginSchema.safeParse(data);
    
    if (!validatedData.success) {
      return { success: false, error: 'Invalid fields', fieldErrors: validatedData.error.flatten().fieldErrors };
    }
    
    await signIn('credentials', {
      email: validatedData.data.email,
      password: validatedData.data.password,
      redirect: false,
    });
    
    return { success: true, data: 'Logged in successfully' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Invalid email or password' };
        default:
          return { success: false, error: 'Something went wrong.' };
      }
    }
    throw error;
  }
}

export async function registerAction(data: RegisterInput): Promise<ActionResult<string>> {
  try {
    const validatedData = registerSchema.safeParse(data);
    
    if (!validatedData.success) {
      return { success: false, error: 'Invalid fields', fieldErrors: validatedData.error.flatten().fieldErrors };
    }
    
    const { name, email, password } = validatedData.data;
    
    const existingUser = await db.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return { success: false, error: 'Email already in use' };
    }
    
    const passwordHash = await bcrypt.hash(password, 12);
    
    await db.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });
    
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    return { success: true, data: 'Registered successfully' };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Registration succeeded, but auto-login failed' };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut();
}
