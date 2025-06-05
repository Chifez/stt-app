'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { register } from './actions';
import { useActionState } from 'react';
import SubmitButton from '@/components/shared/SubmitButton';

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, undefined);

  // Only show error toasts - success is handled server-side with redirect
  if (state?.error) {
    toast.error('Registration Failed', {
      description: state.error,
    });
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your information below to create your account
        </p>
      </div>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            autoComplete="given-name"
          />
        </div>
        {state?.errors?.name && (
          <p className="text-red-500 text-sm">{state.errors.name}</p>
        )}
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
            autoComplete="new-password"
          />
        </div>
        {state?.errors?.password && (
          <p className="text-red-500 text-sm">{state.errors.password}</p>
        )}
        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        <SubmitButton label="Creating account...">Register</SubmitButton>
      </form>
    </div>
  );
}
