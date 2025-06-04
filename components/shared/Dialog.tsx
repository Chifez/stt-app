'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Save } from 'lucide-react';
import { useCreateTranscript } from '@/lib/utils/hooks/useCreateTranscript';

export function SaveDialog({
  transcript,
  setTranscript,
}: {
  transcript: string | any;
  setTranscript: (transcript: string | any) => void;
}) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateTranscript();

  const handleSave = () => {
    mutate(transcript, {
      onSuccess: () => {
        setTranscript('');
        setOpen(false);
      },
    });
  };

  // Don't allow opening dialog if transcript is empty
  if (transcript === '') {
    return (
      <span className="cursor-not-allowed opacity-50">
        <Save size={16} strokeWidth={1.25} />
      </span>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer">
          <Save size={16} strokeWidth={1.25} />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Transcript</DialogTitle>
          <DialogDescription>
            Would you like to save this transcript?
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[200px] overflow-y-auto my-4 p-2 bg-gray-100 rounded">
          <p className="text-sm">{transcript}</p>
        </div>

        <DialogFooter className="gap-2">
          <Button onClick={handleSave} className="bg-blue-500">
            {isPending ? 'Saving..' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
