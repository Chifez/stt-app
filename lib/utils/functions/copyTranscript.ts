export const copyTranscript = (transcript: string) => {
  return navigator.clipboard.writeText(transcript);
};
