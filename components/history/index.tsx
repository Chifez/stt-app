'use client';

import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import useConverter from '@/lib/utils/hooks/useConverter';
// import { deleteTranscript } from '@/lib/utils/functions/deleteTranscript';
import TranscriptCard from '../shared/TranscriptCard';
import { ListFilter, Loader2, Search } from 'lucide-react';
import { Input } from '../ui/input';
import Link from 'next/link';
import { AudioFileProvider } from '@/lib/utils/context/audiofilecontext/useAudioFile';
import { useGetTranscripts } from '@/lib/utils/hooks/useFetchTranscript';
import { useUpdateTranscript } from '@/lib/utils/hooks/useUpdateTranscript';
import { useDeleteTranscript } from '@/lib/utils/hooks/useDeleteTranscript';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface Transcript {
  _id: string;
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
  const [searchValue, setSearchValue] = useState<string>('');

  const { data, isLoading, isFetching, error } = useGetTranscripts();
  const { mutate: updateTranscript, isPending: isUpdating } =
    useUpdateTranscript();
  const { mutate: deleteTranscript, isPending: isDeleting } =
    useDeleteTranscript();

  console.log('data', data);

  const { convertToSpeech, isSpeaking, speakingIndex, speakingId } =
    useConverter();

  // Memoize the color generation function
  const generateColorMap = useCallback((transcripts: Transcript[]) => {
    const newColors: Record<string, string> = {};
    transcripts?.forEach((transcript) => {
      if (!cardColors[transcript._id]) {
        newColors[transcript._id] =
          BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
      }
    });
    return (prev: Record<string, string>) => ({ ...prev, ...newColors });
  }, []);

  const handleDelete = (id: string) => {
    deleteTranscript(id, {
      onSuccess: () => setHistory((prev) => prev.filter((t) => t._id !== id)),
    });
  };

  // Memoize the speak handler
  const handleSpeak = useCallback(
    (text: string, id: string) => {
      convertToSpeech(text, id);
    },
    [convertToSpeech]
  );

  const handleEdit = (id: string, newText: string) => {
    updateTranscript(
      { id, newText },
      {
        onSuccess: () =>
          setHistory((prev) =>
            prev.map((t) => (t._id === id ? { ...t, text: newText } : t))
          ),
      }
    );
  };

  const filteredHistory = useMemo(() => {
    if (!searchValue) return history;
    return history.filter((item) =>
      item.text.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [history, searchValue]);

  useEffect(() => {
    if (data?.transcript) {
      setHistory(data.transcript);
      setCardColors(generateColorMap(data.transcript));
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading transcripts</div>;
  }

  return (
    <>
      <Dialog open={isDeleting || isUpdating}>
        <DialogContent>
          <DialogTitle>Loading</DialogTitle>
          <div className="flex items-center gap-2">
            <p>{isDeleting ? 'Deleting transcript' : 'Updating transcript'}</p>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-center gap-4 w-full">
        <div className="w-full  flex items-center justify-center">
          <div className="relative w-[90%] md:w-[60%] lg:w-[40%] flex items-center justify-center">
            <Input
              value={searchValue}
              className="w-full border border-black focus-visible:ring-0"
              placeholder="Search history"
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button className="absolute right-1 bg-black p-2 rounded">
              <Search size={18} strokeWidth={1.25} className="stroke-white" />
            </button>
          </div>
        </div>
        {/* <div className="flex items-center justify-end ">
          <ListFilter strokeWidth={1.25} />
        </div> */}
      </div>
      {filteredHistory?.length > 0 ? (
        <div className="columns-1 md:columns-2 space-y-6 overflow-visible py-2">
          {filteredHistory.map((item: Transcript) => (
            <div key={item._id}>
              <TranscriptCard
                id={item._id}
                text={item.text}
                bgColor={cardColors[item._id]}
                isSpeaking={isSpeaking}
                speakingIndex={speakingIndex}
                speakingId={speakingId}
                onDelete={handleDelete}
                onSpeak={handleSpeak}
                onEdit={handleEdit}
              />
            </div>
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
