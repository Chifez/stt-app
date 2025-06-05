import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteTranscript } from '@/lib/utils/functions/transcript-action';

export const useDeleteTranscript = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTranscript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts'] });
      toast.success('Transcript deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete transcript error:', error);
      toast.error('Failed to delete transcript', {
        description: error?.message || 'Please try again later',
      });
    },
  });
};
