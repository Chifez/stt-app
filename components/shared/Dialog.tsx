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
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '@radix-ui/react-dialog';

import { Save } from 'lucide-react';

interface DialogProps {
  transcript: string;
}

export function SaveDialog({ transcript }: DialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsLoading(true);

    try {
      const savedTranscripts = JSON.parse(
        localStorage.getItem('transcripts') || '[]'
      );

      const newTranscript = {
        id: Date.now(),
        text: transcript,
        date: new Date().toISOString(),
      };
      savedTranscripts.push(newTranscript);
      localStorage.setItem('transcripts', JSON.stringify(savedTranscripts));

      setOpen(false); // Close dialog after successful save
      toast({
        description: 'Transcript Saved successfully',
      });
    } catch (error) {
      console.log(error);

      console.log('error saving');
      toast({
        description: 'error saving transcript',
      });
    } finally {
      setIsLoading(false);
    }
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
            {isLoading ? 'Saving..' : 'Save'}
          </Button>

          {/* <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
