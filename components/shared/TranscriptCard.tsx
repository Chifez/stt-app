import { memo } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Copy, Trash, Volume2 } from 'lucide-react';
import { copyTranscript } from '@/lib/utils/functions/copyTranscript';

interface TranscriptCardProps {
  id: string;
  text: string;
  bgColor: string;
  isSpeaking: boolean;
  speakingIndex: number;
  speakingId: string | null;
  onDelete: (id: string) => void;
  onSpeak: (text: string, id: string) => void;
}

const TranscriptCard = memo(
  ({
    id,
    text,
    bgColor,
    isSpeaking,
    speakingIndex,
    speakingId,
    onDelete,
    onSpeak,
  }: TranscriptCardProps) => {
    const highlightSpokenText = (text: string, index: number) => {
      if (!isSpeaking) return text;

      const words = text.split(' ');
      const beforeSpoken = words.slice(0, index).join(' ');
      const currentWord = words[index];
      const afterSpoken = words.slice(index + 1).join(' ');

      return (
        <>
          {beforeSpoken}{' '}
          <span className="bg-black text-white px-1 rounded-sm">
            {currentWord}
          </span>{' '}
          {afterSpoken}
        </>
      );
    };

    return (
      <Card
        className={`w-full h-fit rounded-lg p-4 break-inside-avoid overflow-visible ${bgColor}`}
      >
        <CardContent className="border-b">
          <p>
            {isSpeaking && speakingId === id
              ? highlightSpokenText(text, speakingIndex)
              : text}
          </p>
        </CardContent>
        <CardFooter className="flex items-start gap-4 p-4">
          <Trash
            strokeWidth={1.25}
            size={16}
            className="cursor-pointer"
            onClick={() => onDelete(id)}
          />
          <Copy
            strokeWidth={1.25}
            size={16}
            className="cursor-pointer"
            onClick={() => copyTranscript(text)}
          />
          <Volume2
            strokeWidth={1.25}
            size={16}
            className="cursor-pointer"
            onClick={() => onSpeak(text, id)}
          />
        </CardFooter>
      </Card>
    );
  }
);

TranscriptCard.displayName = 'TranscriptCard';

export default TranscriptCard;
