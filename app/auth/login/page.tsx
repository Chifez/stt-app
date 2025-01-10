'use client';

import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { login } from './actions';
import { useActionState } from 'react';
import SubmitButton from '@/components/shared/SubmitButton';

export default function LoginPage() {
  const [state, formAction] = useActionState(login, null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    const result: any = await formAction(formData);
    if (result?.success) {
      toast({
        title: 'Login Successful',
        description: 'Redirecting to converter page...',
      });
      setTimeout(() => router.push('/converter'), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email below to login to your account
        </p>
      </div>
      <form action={handleSubmit} className="space-y-4">
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
        <SubmitButton label="loading...">Login</SubmitButton>
      </form>
    </div>
  );
}
