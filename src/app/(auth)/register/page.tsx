'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WalletCards, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { registerSchema, RegisterInput } from '@/lib/validators';
import { registerAction } from '@/server/actions/auth.actions';

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsPending(true);
    try {
      const result = await registerAction(data);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success('Registration successful! Please log in.');
        router.push('/login');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <div className="flex items-center gap-2 text-primary mb-2">
          <WalletCards className="h-8 w-8" />
          <span className="text-2xl font-bold">FinTrack</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create an Account
        </h1>
        <p className="text-sm text-secondary-fg">
          Start tracking your expenses with FinTrack
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none text-foreground"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register('name')}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
            }`}
          />
          {errors.name && (
            <p className="text-sm font-medium text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none text-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register('email')}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
            }`}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none text-foreground"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
            }`}
          />
          {errors.password && (
            <p className="text-sm font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium leading-none text-foreground"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-sm font-medium text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 h-10"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Sign up'
          )}
        </button>
      </form>

      <div className="text-center text-sm text-secondary-fg">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
