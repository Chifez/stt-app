import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTranscripts } from '@/lib/utils/functions/transcript-action';
import { useToast } from '@/hooks/use-toast';

export const useDeleteTranscript = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: deleteTranscripts,
    mutationKey: ['transcript'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts'] });
      return toast({
        description: 'Updated successfully',
      });
    },
  });
};
