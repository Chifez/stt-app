'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { login } from './actions';
import { useActionState } from 'react';
import SubmitButton from '@/components/shared/SubmitButton';

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null);

  // Only show error toasts - success is handled server-side with redirect
  if (state?.error) {
    toast.error('Login Failed', {
      description: state.error,
    });
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email below to login to your account
        </p>
      </div>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
            autoComplete="email"
          />
        </div>
        {state?.errors?.email && (
          <p className="text-red-500 text-sm">{state.errors.email}</p>
        )}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            minLength={6}
            autoComplete="current-password"
          />
        </div>
        {state?.errors?.password && (
          <p className="text-red-500 text-sm">{state.errors.password}</p>
        )}
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <SubmitButton label="Signing in...">Login</SubmitButton>
      </form>
    </div>
  );
}
