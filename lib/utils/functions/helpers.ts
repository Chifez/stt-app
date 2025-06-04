export const copyTranscript = (transcript: string) => {
  return navigator.clipboard.writeText(transcript);
};

// Helper function to determine the correct base URL for API calls
export const getApiUrl = () => {
  // In development, use localhost without SSL
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_API_URL || 'localhost:3000';
  }

  // In production, use Vercel URL or provided API URL
  const baseUrl = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_API_URL;
  return baseUrl;
};

// For backward compatibility
export const baseUrl = getApiUrl();

// Helper function to build complete API URL with proper protocol
export const buildApiUrl = (endpoint: string) => {
  const base = getApiUrl();
  const protocol =
    process.env.NODE_ENV === 'development' ? 'http://' : 'https://';
  return `${protocol}${base}${endpoint}`;
};
