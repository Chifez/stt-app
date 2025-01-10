'use server';

import { z } from 'zod';
import { createSession } from '@/lib/utils/controllers/authMiddleware';
import { redirect } from 'next/navigation';
import { baseUrl } from '@/lib/utils/baseurl';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function login(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: 'Form data is missing' };
  }

  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`https://${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedFields.data),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.error || 'Login failed' };
  }
  await createSession(data.token);
  redirect('/converter');
}
