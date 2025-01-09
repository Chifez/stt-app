'use server';

import { cookies } from 'next/headers';
import { baseUrl } from '../baseurl';

const BASE_URL = `https://${baseUrl}`;

export const createTranscript = async (transcriptData: any) => {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${BASE_URL}/api/transcript/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify({ text: transcriptData }),
  });

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

  const response = await fetch(`${BASE_URL}/api/transcript/all`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get transcript');
  }
  const responseData = await response.json();
  console.log('list', responseData);
  return responseData;
};

export const updateTranscripts = async ({
  id,
  newText,
}: {
  id: string;
  newText: string;
}) => {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${BASE_URL}/api/transcript/update?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify({ text: newText }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get transcript');
  }
  const responseData = await response.json();
  console.log('list', responseData);
  return responseData;
};

export const deleteTranscripts = async (id: string) => {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${BASE_URL}/api/transcript/delete?id=${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get transcript');
  }
  const responseData = await response.json();
  console.log('list', responseData);
  return responseData;
};

export async function getUserProfile() {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${BASE_URL}/api/user`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get transcript');
  }
  const responseData = await response.json();
  console.log('list', responseData);
  return responseData;
}
