'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useConverter from '@/lib/utils/hooks/useConverter';
import { deleteTranscript } from '@/lib/utils/functions/deleteTranscript';
import TranscriptCard from '../shared/TranscriptCard';
import { Filter } from 'lucide-react';

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

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <>
      <div>
        <Filter />
      </div>
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
          />
        ))}
      </div>
    </>
  );
};

export default HistoryPage;
