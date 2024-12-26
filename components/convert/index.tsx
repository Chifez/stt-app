'use client';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

import {
  ChevronLeftIcon,
  Copy,
  Download,
  Mic,
  NotepadText,
  Pause,
  Podcast,
  RotateCcw,
  Square,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { AudioWave } from '../shared/AudioWave';
import useConverter from '@/lib/utils/hooks/useConverter';

const Convert = () => {
  const {
    transcript,
    interimTranscript,
    isListening,
    stopListening,
    setTranscript,
    convertToText: onListening,
  } = useConverter();

  return (
    <div className="w-[60%] mx-auto space-y-8">
      <nav className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-1">
          <ChevronLeftIcon />
          Back
        </div>

        <div className="flex items-center gap-4">
          <span onClick={onListening} className="cursor-pointer">
            <Mic strokeWidth={1.25} />
          </span>
          <span className="cursor-pointer">
            <Podcast strokeWidth={1.25} />
          </span>
          <span className="cursor-pointer">
            <NotepadText strokeWidth={1.25} />
          </span>
        </div>
      </nav>

      <Card className="relative w-[80%] min-h-[200px] max-h-[300px] mx-auto py-4 px-2 bg-blue-500/80">
        <div className="absolute top-2 right-2 flex items-center gap-4">
          <span>
            <Copy size={16} strokeWidth={1.25} />
          </span>
          <span>
            <Download size={16} strokeWidth={1.25} />
          </span>
        </div>
        <CardContent className="h-full overflow-y-auto scrollbar-hide mt-2">
          <div className="flex flex-col h-full">
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

      <div className="flex flex-col items-center justify-center mx-auto">
        <AudioWave />
        <p className="text-gray-500">{isListening ? 'Now listening' : ''}</p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button onClick={stopListening}>
          <Pause />
        </button>
        <button onClick={onListening}>
          <Square />
        </button>
        <button onClick={() => setTranscript('')}>
          <RotateCcw />
        </button>
      </div>
    </div>
  );
};

export default Convert;
