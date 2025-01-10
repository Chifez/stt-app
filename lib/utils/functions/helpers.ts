export const copyTranscript = (transcript: string) => {
  return navigator.clipboard.writeText(transcript);
};

export const baseUrl =
  process.env.VERCEL_URL ?? process.env.NEXT_PUBLIC_API_URL;
