'use client';

import { useCallback, useMemo, useState } from 'react';
import useConverter from '@/lib/utils/hooks/useConverter';
import TranscriptCard from '../shared/TranscriptCard';
import { Loader2, Search } from 'lucide-react';
import { Input } from '../ui/input';
import Link from 'next/link';
import { useGetTranscripts } from '@/lib/utils/hooks/useFetchTranscript';
import { useUpdateTranscript } from '@/lib/utils/hooks/useUpdateTranscript';
import { useDeleteTranscript } from '@/lib/utils/hooks/useDeleteTranscript';

import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

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
  const [searchValue, setSearchValue] = useState<string>('');

  const { data, isLoading, error } = useGetTranscripts();
  const { mutate: updateTranscript, isPending: isUpdating } =
    useUpdateTranscript();
  const { mutate: deleteTranscript, isPending: isDeleting } =
    useDeleteTranscript();

  const { convertToSpeech, isSpeaking, speakingIndex, speakingId } =
    useConverter();

  // Derive transcripts directly from data instead of syncing to local state
  const transcripts = data?.transcript || [];

  // Generate color map only when transcripts change, memoized for performance
  const cardColors = useMemo(() => {
    const colors: Record<string, string> = {};
    transcripts.forEach((transcript: Transcript) => {
      if (!colors[transcript._id]) {
        colors[transcript._id] =
          BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
      }
    });
    return colors;
  }, [transcripts]);

  // Memoize filtered results
  const filteredHistory = useMemo(() => {
    if (!searchValue) return transcripts;
    return transcripts.filter((item: Transcript) =>
      item.text.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [transcripts, searchValue]);

  // Handlers with no side effects - let React Query handle optimistic updates
  const handleDelete = useCallback(
    (id: string) => {
      deleteTranscript(id);
    },
    [deleteTranscript]
  );

  const handleSpeak = useCallback(
    (text: string, id: string) => {
      convertToSpeech(text, id);
    },
    [convertToSpeech]
  );

  const handleEdit = useCallback(
    (id: string, newText: string) => {
      updateTranscript({ id, newText });
    },
    [updateTranscript]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading transcripts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <p className="text-red-500 font-medium">Error loading transcripts</p>
          <p className="text-gray-500 text-sm">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
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
        <div className="w-full flex items-center justify-center">
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
      </div>

      {filteredHistory.length > 0 ? (
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
