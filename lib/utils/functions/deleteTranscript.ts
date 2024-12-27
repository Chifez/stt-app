export const deleteTranscript = (id: string) => {
  const savedTranscripts = localStorage.getItem('transcripts');
  if (savedTranscripts) {
    const transcripts = JSON.parse(savedTranscripts);
    const filteredTranscripts = transcripts.filter(
      (t: { id: string }) => t.id !== id
    );
    localStorage.setItem('transcripts', JSON.stringify(filteredTranscripts));
    return true;
  }
  return false;
};
