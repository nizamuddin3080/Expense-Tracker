import { z } from 'zod';

// ---- Reusable Field Schemas ----
const monetaryAmount = z
  .string()
  .refine((val) => /^\d{1,13}(\.\d{1,2})?$/.test(val), {
    message: 'Invalid amount format',
  })
  .refine((val) => parseFloat(val) > 0, {
    message: 'Amount must be greater than zero',
  });

const requiredString = (fieldName: string, max: number) =>
  z.string().trim().min(1, `${fieldName} is required`).max(max, `${fieldName} must be ${max} characters or less`);

const optionalString = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(''));

// ---- Auth Schemas ----
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: requiredString('Name', 100),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ---- Account Schemas ----
export const createAccountSchema = z.object({
  name: requiredString('Account name', 100),
  type: z.enum(['CASH', 'BANK', 'MOBILE_BANKING', 'CREDIT_CARD', 'DIGITAL_WALLET', 'OTHER']),
  openingBalance: z.string().refine((val) => /^\d{1,13}(\.\d{1,2})?$/.test(val), {
    message: 'Invalid balance format',
  }),
  currency: z.string().default('BDT'),
  icon: z.string().optional(),
});

export const updateAccountSchema = createAccountSchema.partial().extend({
  id: z.string().cuid(),
  isActive: z.boolean().optional(),
});

// ---- Transaction Schemas ----
export const createTransactionSchema = z.object({
  type: z.enum(['EXPENSE', 'INCOME', 'TRANSFER']),
  amount: monetaryAmount,
  accountId: z.string().cuid('Please select an account'),
  toAccountId: z.string().cuid('Please select a destination account').optional().nullable(),
  categoryId: z.string().cuid('Please select a category').optional().nullable(),
  subcategoryId: z.string().cuid().optional().nullable(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  merchant: optionalString(100),
  paymentMethod: optionalString(50),
  note: optionalString(500),
  tags: z.array(z.string().max(30)).max(10).optional(),
}).superRefine((data, ctx) => {
  // Transfer requires toAccountId
  if (data.type === 'TRANSFER' && !data.toAccountId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Destination account is required for transfers',
      path: ['toAccountId'],
    });
  }
  // Transfer must not have same source and destination
  if (data.type === 'TRANSFER' && data.accountId === data.toAccountId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Source and destination accounts must be different',
      path: ['toAccountId'],
    });
  }
  // Expense and Income require categoryId
  if ((data.type === 'EXPENSE' || data.type === 'INCOME') && !data.categoryId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Category is required',
      path: ['categoryId'],
    });
  }
});

export const updateTransactionSchema = createTransactionSchema.extend({
  id: z.string().cuid(),
});

// ---- Category Schemas ----
export const createCategorySchema = z.object({
  name: requiredString('Category name', 50),
  type: z.enum(['EXPENSE', 'INCOME']),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional().or(z.literal('')),
  parentId: z.string().cuid().optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string().cuid(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

// ---- Budget Schemas ----
export const createBudgetSchema = z.object({
  categoryId: z.string().cuid('Please select a category'),
  amount: monetaryAmount,
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

export const updateBudgetSchema = createBudgetSchema.partial().extend({
  id: z.string().cuid(),
});

// ---- Savings Goal Schemas ----
export const createGoalSchema = z.object({
  name: requiredString('Goal name', 100),
  targetAmount: monetaryAmount,
  targetDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date').optional().nullable(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal('')),
});

export const goalTransactionSchema = z.object({
  goalId: z.string().cuid(),
  amount: z.string().refine((val) => /^-?\d{1,13}(\.\d{1,2})?$/.test(val), {
    message: 'Invalid amount format',
  }),
  note: optionalString(500),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
});

// ---- Recurring Transaction Schemas ----
export const createRecurringSchema = z.object({
  type: z.enum(['EXPENSE', 'INCOME']),
  amount: monetaryAmount,
  accountId: z.string().cuid('Please select an account'),
  categoryId: z.string().cuid('Please select a category'),
  subcategoryId: z.string().cuid().optional().nullable(),
  merchant: optionalString(100),
  note: optionalString(500),
  frequency: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM']),
  interval: z.number().int().min(1).default(1),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date').optional().nullable(),
});

// ---- Settings Schemas ----
export const updateProfileSchema = z.object({
  name: requiredString('Name', 100),
  email: z.string().email('Please enter a valid email'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const updatePreferencesSchema = z.object({
  defaultCurrency: z.string().default('BDT'),
  defaultAccountId: z.string().cuid().optional().nullable(),
  dateFormat: z.string().default('DD/MM/YYYY'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
});

// ---- Type exports for form usage ----
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type GoalTransactionInput = z.infer<typeof goalTransactionSchema>;
export type CreateRecurringInput = z.infer<typeof createRecurringSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
