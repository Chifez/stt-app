'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Copy, Trash, Volume2 } from 'lucide-react';
import { deleteTranscript } from '@/lib/utils/functions/deleteTranscript';
import { copyTranscript } from '@/lib/utils/functions/copyTranscript';
import useConverter from '@/lib/utils/hooks/useConverter';

interface Transcript {
  id: string;
  text: string;
  date: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<Transcript[]>([]);
  const { convertToSpeech, isSpeaking, speakingIndex, speakingId } =
    useConverter();

  const loadHistory = () => {
    const savedTranscripts = localStorage.getItem('transcripts');
    if (savedTranscripts) {
      const parsedTranscripts: Transcript[] = JSON.parse(savedTranscripts);
      console.log(parsedTranscripts);
      setHistory(parsedTranscripts);
    }
  };

  const BG_COLOR = ['bg-blue-300/90', 'bg-green-300/90', 'bg-purple-300/90'];

  const generateBg = () => {
    const bgIdx = Math.floor(Math.random() * BG_COLOR.length);
    return BG_COLOR[bgIdx];
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = (id: string) => {
    deleteTranscript(id);
    loadHistory(); // Reload the list after deletion
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
    <div className="columns-2 space-y-6 overflow-visible py-2">
      {history.map((item) => (
        <Card
          key={item.id}
          className={`w-full h-fit rounded-lg p-4 break-inside-avoid overflow-visible ${generateBg()}`}
        >
          <CardContent className="border-b">
            <p>
              {isSpeaking && speakingId === item.id
                ? highlightSpokenText(item.text, speakingIndex)
                : item.text}
            </p>
          </CardContent>
          <CardFooter className="flex items-start gap-4 p-4">
            <Trash
              strokeWidth={1.25}
              size={16}
              className="cursor-pointer"
              onClick={() => handleDelete(item.id)}
            />
            <Copy
              strokeWidth={1.25}
              size={16}
              className="cursor-pointer"
              onClick={() => copyTranscript(item.text)}
            />
            <Volume2
              strokeWidth={1.25}
              size={16}
              className="cursor-pointer"
              onClick={() => convertToSpeech(item.text, item.id)}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default HistoryPage;
