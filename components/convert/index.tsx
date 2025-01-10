'use client';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

import { Copy, Mic, RotateCcw, Square, Pencil } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { AudioWave } from '../shared/AudioWave';
import useConverter from '@/lib/utils/hooks/useConverter';
import { copyTranscript } from '@/lib/utils/functions/copyTranscript';
import { SaveDialog } from '../shared/Dialog';
import { useRef, useEffect, useState } from 'react';
import ShareTranscript from '../shared/ShareTranscript';
import EditableContent from '../shared/EditableContent';

const Convert = () => {
  const [editing, setEditing] = useState(false);
  const {
    transcript,
    interimTranscript,
    isListening,
    stopListening,
    setTranscript,
    convertToText: onListening,
  } = useConverter();

  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleEdit = () => {
    if (!transcript) return;
    setEditing(!editing);
  };

  useEffect(() => {
    // this isn't working for some reason
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  return (
    <>
      <Card
        ref={cardRef}
        className="relative w-full md:w-[80%] min-h-[300px] md:min-h-[200px] overflow-y-scroll scrollbar-hide max-h-[400px] md:max-h-[250px] mx-auto py-8 px-2 bg-blue-300/80"
      >
        <div className="absolute top-2 z-10 right-2 flex items-center gap-4 action-icons">
          <span
            className="cursor-pointer"
            onClick={() => copyTranscript(transcript)}
          >
            <Copy size={16} strokeWidth={1.25} />
          </span>
          <SaveDialog transcript={transcript} setTranscript={setTranscript} />
          <ShareTranscript
            text={transcript}
            bgColor="bg-blue-300"
            cardRef={cardRef}
          />
          <button onClick={toggleEdit} className="cursor-pointer">
            <Pencil size={14} strokeWidth={1.25} />
          </button>
        </div>
        <CardContent
          ref={contentRef}
          className="flex-1 min-h-[80%] overflow-y-auto scrollbar-hide"
        >
          <div className="flex flex-col h-full">
            {transcript || interimTranscript ? (
              <>
                <EditableContent
                  content={transcript}
                  onSave={setTranscript}
                  className="flex flex-wrap h-full"
                  isEditing={editing}
                  setIsEditing={setEditing}
                />
                {isListening && (
                  <p className="bg-black px-1 w-fit rounded-sm text-white">
                    {interimTranscript}
                    <span className="inline-block w-[2px] h-4 ml-[2px] bg-white animate-caret" />
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-start italic">
                Click the microphone to start recording...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <div className="flex flex-col items-center justify-center mx-auto mb-1">
          <AudioWave isListening={isListening} />
          <p
            className={`text-gray-500 ${isListening ? 'visible' : 'invisible'}`}
          >
            Now listening
          </p>
        </div>
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={stopListening}
            className="hover:bg-blue-300/80 p-2 rounded-full"
          >
            <Square strokeWidth={1.5} />
          </button>
          <button
            onClick={onListening}
            className="hover:bg-blue-300/80 p-2 rounded-full"
          >
            <Mic strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setTranscript('')}
            className="hover:bg-blue-300/80 p-2 rounded-full"
          >
            <RotateCcw strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Convert;
