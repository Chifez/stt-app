'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useConverter from '@/lib/utils/hooks/useConverter';
import { deleteTranscript } from '@/lib/utils/functions/deleteTranscript';
import TranscriptCard from '../shared/TranscriptCard';
import { Filter, ListFilter, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';

interface Transcript {
  id: string;
  text: string;
  date: string;
}

const BG_COLORS = [
  'bg-blue-300/90',
  'bg-green-300/90',
  'bg-purple-300/90',
] as const;

const HistoryPage = () => {
  const [history, setHistory] = useState<Transcript[]>([]);
  const [cardColors, setCardColors] = useState<Record<string, string>>({});

  const { convertToSpeech, isSpeaking, speakingIndex, speakingId } =
    useConverter();

  // Memoize the color generation function
  const generateColorMap = useCallback((transcripts: Transcript[]) => {
    const newColors: Record<string, string> = {};
    transcripts.forEach((transcript) => {
      if (!cardColors[transcript.id]) {
        newColors[transcript.id] =
          BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
      }
    });
    return (prev: Record<string, string>) => ({ ...prev, ...newColors });
  }, []);

  // Memoize the load history function
  const loadHistory = useCallback(() => {
    const savedTranscripts = localStorage.getItem('transcripts');
    if (savedTranscripts) {
      const parsedTranscripts: Transcript[] = JSON.parse(savedTranscripts);
      const sortedTranscripts = parsedTranscripts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setHistory(sortedTranscripts);
      setCardColors(generateColorMap(sortedTranscripts));
    }
  }, []);

  // Memoize the delete handler
  const handleDelete = (id: string) => {
    deleteTranscript(id);
    loadHistory();
  };

  // Memoize the speak handler
  const handleSpeak = useCallback(
    (text: string, id: string) => {
      convertToSpeech(text, id);
    },
    [convertToSpeech]
  );

  const handleEdit = (id: string, newText: string) => {
    const savedTranscripts = localStorage.getItem('transcripts');
    if (savedTranscripts) {
      const transcripts = JSON.parse(savedTranscripts);
      const updatedTranscripts = transcripts.map((t: Transcript) =>
        t.id === id ? { ...t, text: newText } : t
      );
      localStorage.setItem('transcripts', JSON.stringify(updatedTranscripts));
      loadHistory();
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <>
      <div className="flex items-center justify-center gap-4 w-full">
        <div className="w-full  flex items-center justify-center">
          <div className="relative w-[90%] md:w-[60%] lg:w-[40%] flex items-center justify-center">
            <Input
              className="w-full border border-black focus-visible:ring-0"
              placeholder="Search history"
            />
            <button className="absolute right-1 bg-black p-2 rounded">
              <Search size={18} strokeWidth={1.25} className="stroke-white" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end ">
          <ListFilter strokeWidth={1.25} />
        </div>
      </div>
      {history.length ? (
        <div className="columns-1 md:columns-2 space-y-6 overflow-visible py-2">
          {history.map((item) => (
            <TranscriptCard
              key={item.id}
              id={item.id}
              text={item.text}
              bgColor={cardColors[item.id]}
              isSpeaking={isSpeaking}
              speakingIndex={speakingIndex}
              speakingId={speakingId}
              onDelete={handleDelete}
              onSpeak={handleSpeak}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col text-center items-center justify-center w-full h-[400px] border border-black rounded-md p-4">
          <div>
            <p className="font-semibold italic">
              You have no saved transcripts
            </p>
            <p className="text-sm">
              Start by making a recording
              <br /> All saved transcripts will appear here
            </p>
          </div>
          <Link
            href="/converter"
            className="text-sm bg-black text-white rounded p-2"
          >
            Go to converter
          </Link>
        </div>
      )}
    </>
  );
};

export default HistoryPage;
