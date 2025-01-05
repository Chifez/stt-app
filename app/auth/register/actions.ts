'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function register(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: 'Form data is missing' };
  }

  const name = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!name || !email || !password) {
    return { error: 'All fields are required' };
  }

  const validatedFields = registerSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    const errors = validatedFields.error.errors.map((error) => error.message);
    return { error: errors.join(', ') };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedFields.data),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Registration failed' };
    }

    (await cookies()).set(
      'user',
      JSON.stringify({ name: data.user.name, email: data.user.email }),
      { httpOnly: true }
    );

    return {
      success: true,
      message: data.message || 'Registration successful',
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'An unexpected error occurred' };
  }
}
