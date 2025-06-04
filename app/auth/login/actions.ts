'use server';

import { z } from 'zod';
import { createSession } from '@/lib/utils/controllers/authMiddleware';
import { buildApiUrl } from '@/lib/utils/functions/helpers';
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

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(buildApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Login failed' };
    }

    // Create session with the token
    if (data.token) {
      await createSession(data.token);
    }
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Network error. Please try again.' };
  }

  // Redirect after successful login - outside try-catch
  redirect('/converter');
}
