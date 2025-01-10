import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTranscripts } from './transcript-action';
import { useToast } from '@/hooks/use-toast';

export const useUpdateTranscript = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: updateTranscripts,
    mutationKey: ['transcript'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts'] });
      return toast({
        description: 'Updated successfully',
      });
    },
  });
};
