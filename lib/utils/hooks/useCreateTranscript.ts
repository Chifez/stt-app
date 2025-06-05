import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createTranscript } from '@/lib/utils/functions/transcript-action';

export const useCreateTranscript = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTranscript,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts'] });
      toast.success('Transcript saved successfully');
    },
    onError: (error: any) => {
      console.error('Create transcript error:', error);
      toast.error('Failed to save transcript', {
        description: error?.message || 'Please try again later',
      });
    },
  });
};
