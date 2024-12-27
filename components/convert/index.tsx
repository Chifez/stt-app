'use client';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

import { Copy, Download, Mic, RotateCcw, Square } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { AudioWave } from '../shared/AudioWave';
import useConverter from '@/lib/utils/hooks/useConverter';
import { copyTranscript } from '@/lib/utils/functions/copyTranscript';
import { downloadTranscript } from '@/lib/utils/functions/downloadTranscript';
import { SaveDialog } from '../shared/Dialog';
import { useRef, useEffect } from 'react';

const Convert = () => {
  const {
    transcript,
    interimTranscript,
    isListening,
    stopListening,
    setTranscript,
    convertToText: onListening,
  } = useConverter();

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [transcript, interimTranscript]);

  return (
    <>
      <Card className="relative w-[80%] min-h-[200px] overflow-y-scroll scrollbar-hide max-h-[250px] mx-auto py-8 px-2 bg-blue-300/80">
        <div className="absolute top-2 z-10 right-2 flex items-center gap-4">
          <span
            className="cursor-pointer"
            onClick={() => copyTranscript(transcript)}
          >
            <Copy size={16} strokeWidth={1.25} />
          </span>
          <SaveDialog transcript={transcript} />
          <span
            className="cursor-pointer"
            onClick={() =>
              downloadTranscript({
                text: transcript,
                date: JSON.stringify(Date.now()),
              })
            }
          >
            <Download size={16} strokeWidth={1.25} />
          </span>
        </div>
        <CardContent
          ref={contentRef}
          className="flex-1 overflow-y-auto scrollbar-hide"
        >
          <div className="flex flex-col">
            {transcript || interimTranscript ? (
              <>
                <span className="flex flex-wrap">
                  {transcript}{' '}
                  <p className="bg-black px-1 w-fit rounded-sm text-white">
                    {interimTranscript}
                    {isListening && (
                      <span className="inline-block w-[2px] h-4 ml-[2px] bg-white animate-caret" />
                    )}
                  </p>
                </span>
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
