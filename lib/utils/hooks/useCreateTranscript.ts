import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTranscript } from '@/lib/utils/functions/transcript-action';
import { useToast } from '@/hooks/use-toast';

export const useCreateTranscript = (setTranscript: any, setOpen: any) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createTranscript,
    mutationKey: ['transcript'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcripts'] });
      setTranscript('');
      setOpen(false);
      return toast({
        description: 'Saved successfully',
      });
    },
  });
};
