// hooks/useTranscripts.js
import { useQuery } from '@tanstack/react-query';
import { getTranscripts } from '@/lib/utils/functions/transcript-action';

export const useGetTranscripts = () => {
  return useQuery({
    queryKey: ['transcripts'],
    queryFn: getTranscripts,

    // staleTime: 0, // Ensures data is always considered stale
    // refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnMount: true,
  });
};
