'use server';

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const createTranscript = async (transcriptData: any) => {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/transcript/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.stringify({ text: transcriptData }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create transcript');
  }

  const responseData = await response.json(); // Await the response JSON
  console.log('response from actions', responseData);

  return responseData; // Return the JSON data directly
};

export const getTranscripts = async () => {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/transcript/all`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get transcript');
  }
  const responseData = await response.json();
  console.log('list', responseData);
  return responseData;
};
