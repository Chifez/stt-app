'use server';

import { cookies } from 'next/headers';
import { buildApiUrl } from './helpers';

export const createTranscript = async (transcriptData: any) => {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(buildApiUrl('/api/transcript/create'), {
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

  const responseData = await response.json();
  return responseData;
};

export const getTranscripts = async () => {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(buildApiUrl('/api/transcript/all'), {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get transcripts');
  }

  const responseData = await response.json();
  return responseData;
};

export const updateTranscript = async (
  transcriptId: string,
  newText: string
) => {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(buildApiUrl('/api/transcript/update'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify({ transcriptId, text: newText }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update transcript');
  }

  const responseData = await response.json();
  return responseData;
};

export const deleteTranscript = async (transcriptId: string) => {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(buildApiUrl('/api/transcript/delete'), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.stringify({ transcriptId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete transcript');
  }

  const responseData = await response.json();
  return responseData;
};

export async function getUserProfile() {
  const token = (await cookies()).get('session');

  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(buildApiUrl('/api/user'), {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get transcript');
  }
  const responseData = await response.json();
  return responseData;
}
