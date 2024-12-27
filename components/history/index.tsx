'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Copy, Trash, Volume2 } from 'lucide-react';
import { deleteTranscript } from '@/lib/utils/functions/deleteTranscript';
import { copyTranscript } from '@/lib/utils/functions/copyTranscript';

interface Transcript {
  id: string;
  text: string;
  date: string;
}

const HistoryPage = () => {
  const [history, setHistory] = useState<Transcript[]>([]);

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

  return (
    <div className="columns-2 space-y-6 overflow-visible py-2">
      {history.map((item, index) => (
        <Card
          key={index}
          className={`w-full h-fit rounded-lg p-4 break-inside-avoid overflow-visible ${generateBg()}`}
        >
          <CardContent className="border-b">
            <p>{item.text}</p>
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
            <Volume2 strokeWidth={1.25} size={16} className="cursor-pointer" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default HistoryPage;
