import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/utils/functions/transcript-action';

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUserProfile,

    // staleTime: 0, // Ensures data is always considered stale
    // refetchOnWindowFocus: true, // Refetch on window focus
    refetchOnMount: true,
  });
};
