// hooks/useCreateTranscript.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTranscript } from './transcript-action';
import { useToast } from '@/hooks/use-toast';
// import { cookies } from 'next/headers';

// const createTranscript = async (transcriptData: any) => {
//   const token = (await cookies()).get('session');

//   const response = await fetch('/api/transcript/create', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(transcriptData),
//   });

//   if (!response.ok) {
//     throw new Error('Failed to create transcript');
//   }

//   return response.json();
// };

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
