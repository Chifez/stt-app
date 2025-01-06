'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { register } from './actions';
import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import SubmitButton from '@/components/shared/SubmitButton';

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, undefined);
  const { pending } = useFormStatus();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    const result: any = await formAction(formData);
    if (result?.success) {
      toast({
        title: 'Registration Successful',
        description: result.message,
      });
      setTimeout(() => router.push('/converter'), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your information below to create your account
        </p>
      </div>
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            required
            type="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            minLength={6}
          />
        </div>
        {state?.error && <p className="text-red-500">{state.error}</p>}
        <SubmitButton label="loading...">Register</SubmitButton>
      </form>
    </div>
  );
}
