'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { createSession } from '@/lib/utils/controllers/authMiddleware';
import { redirect } from 'next/navigation';

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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    const errors = validatedFields.error.errors.map((error) => error.message);
    return { error: errors.join(', ') };
  }

  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedFields.data),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.error || 'Login failed' };
  }
  console.log('token here 2', data.token);
  await createSession(data.token);
  redirect('/converter');
}
