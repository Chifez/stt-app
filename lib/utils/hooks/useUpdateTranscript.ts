import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateTranscript } from '@/lib/utils/functions/transcript-action';

export const useUpdateTranscript = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newText }: { id: string; newText: string }) =>
      updateTranscript(id, newText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts'] });
      toast.success('Transcript updated successfully');
    },
    onError: (error: any) => {
      console.error('Update transcript error:', error);
      toast.error('Failed to update transcript', {
        description: error?.message || 'Please try again later',
      });
    },
  });
};
