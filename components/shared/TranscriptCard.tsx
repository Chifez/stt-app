import { memo, useRef, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Copy, Trash, Volume2, Pencil } from 'lucide-react';
import { copyTranscript } from '@/lib/utils/functions/helpers';
import ShareTranscript from './ShareTranscript';
import EditableContent from './EditableContent';
import { toast } from 'sonner';

interface TranscriptCardProps {
  id: string;
  text: string;
  bgColor: string;
  isSpeaking: boolean;
  speakingIndex: number;
  speakingId: string | null;
  onDelete: (id: string) => void;
  onSpeak: (text: string, id: string) => void;
  onEdit?: (id: string, newText: string) => void;
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
    onEdit,
  }: TranscriptCardProps) => {
    const [editing, setEditing] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const toggleEdit = () => {
      if (!text) return;
      setEditing(!editing);
    };

    const handleCopy = () => {
      copyTranscript(text);
      toast.success('Copied to clipboard');
    };

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
        key={id}
        ref={cardRef}
        className={`w-full h-fit rounded-lg p-4 break-inside-avoid overflow-visible ${bgColor}`}
      >
        <CardContent className="border-b">
          <EditableContent
            content={
              isSpeaking && speakingId === id
                ? highlightSpokenText(text, speakingIndex)
                : text
            }
            onSave={(newText) => onEdit?.(id, newText)}
            className="whitespace-pre-wrap"
            isEditing={editing}
            setIsEditing={setEditing}
          />
        </CardContent>
        <CardFooter className="flex items-start gap-4 p-4 action-icons">
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
            onClick={handleCopy}
          />
          <ShareTranscript text={text} bgColor={bgColor} cardRef={cardRef} />
          <Volume2
            strokeWidth={1.25}
            size={16}
            className="cursor-pointer"
            onClick={() => onSpeak(text, id)}
          />
          <button onClick={toggleEdit} className="cursor-pointer">
            <Pencil size={14} strokeWidth={1.25} />
          </button>
        </CardFooter>
      </Card>
    );
  }
);

TranscriptCard.displayName = 'TranscriptCard';

export default TranscriptCard;
