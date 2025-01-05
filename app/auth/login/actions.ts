'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';

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
    const errors = validatedFields.error.errors.map((error) => error.message);
    return { error: errors.join(', ') };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedFields.data),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Login failed' };
    }

    (await cookies()).set(
      'user',
      JSON.stringify({ email: validatedFields.data.email }),
      { httpOnly: true }
    );

    return { success: true, message: 'Login successful' };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred' };
  }
}