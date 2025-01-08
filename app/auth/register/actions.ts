'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { createSession } from '@/lib/utils/controllers/authMiddleware';
import { redirect } from 'next/navigation';

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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!name || !email || !password) {
    return { error: 'All fields are required' };
  }
  console.log('baseURL', baseUrl);

  const validatedFields = registerSchema.safeParse({ name, email, password });
  console.log(validatedFields.data);

  if (!validatedFields.success) {
    // const errors = validatedFields.error.errors.map((error) => error.message);
    // return { error: errors.join(', ') };
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedFields.data),
  });

  const data = await response.json();

  if (!response.ok) {
    return { error: data.error || 'Registration failed' };
  }
  console.log('token here 3', data.token);
  await createSession(data.token);
  redirect('/converter');
}
