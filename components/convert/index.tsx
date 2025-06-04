'use client';

/**
 * @interface global declaration of the window object
 */
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

import { Copy, Mic, RotateCcw, Square, Pencil } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import useConverter from '@/lib/utils/hooks/useConverter';
import { copyTranscript } from '@/lib/utils/functions/helpers';
import { SaveDialog } from '../shared/Dialog';
import { useRef, useEffect, useState } from 'react';

import EditableContent from '../shared/EditableContent';
import { toast } from 'sonner';
import ShareTranscript from '../shared/ShareTranscript';
import { DynamicAudioWave } from '../shared/DynamicAudioWave';

const Convert = () => {
  const [editing, setEditing] = useState(false);
  const {
    transcript,
    interimTranscript,
    isListening,
    isLoading,
    error,
    isSupported,
    stopListening,
    setTranscript,
    convertToText: onListening,
    clearError,
  } = useConverter();

  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleEdit = () => {
    if (!transcript) return;
    setEditing(!editing);
  };

  const handleCopy = () => {
    copyTranscript(transcript);
    toast.success('Copied successfully');
  };

  const handleStartListening = () => {
    clearError();
    onListening();
  };

  // Auto-scroll effect - only runs when transcript content changes
  useEffect(() => {
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
          <span className="cursor-pointer" onClick={handleCopy}>
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
            {!isSupported ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                <p className="text-red-500 font-medium">
                  Speech recognition is not supported in your browser
                </p>
                <p className="text-gray-500 text-sm">
                  Please try using Chrome, Edge, or Safari
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Initializing speech recognition...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                <p className="text-red-500 font-medium">{error}</p>
                <button
                  onClick={clearError}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Try again
                </button>
              </div>
            ) : transcript || interimTranscript ? (
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

      <div className="flex flex-col items-center justify-center mx-auto mb-1">
        <DynamicAudioWave isListening={isListening} />

        {/* Previous simple visualization - kept for reference
        <div className="flex items-center justify-center space-x-1 h-10">
          {isListening ? (
            Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-1 bg-blue-500 rounded-full animate-pulse`}
                style={{
                  height: `${20 + Math.random() * 20}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))
          ) : (
            Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="w-1 h-3 bg-gray-300 rounded-full"
              />
            ))
          )}
        </div>
        */}

        <p className={`text-gray-500 ${isListening ? 'visible' : 'invisible'}`}>
          Now listening
        </p>
      </div>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={stopListening}
          disabled={!isListening}
          className={`p-2 rounded-full transition-colors ${
            isListening
              ? 'hover:bg-blue-300/80 text-gray-700'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Stop recording"
        >
          <Square strokeWidth={1.5} />
        </button>
        <button
          onClick={handleStartListening}
          disabled={!isSupported || isLoading}
          className={`p-2 rounded-full transition-colors ${
            !isSupported || isLoading
              ? 'text-gray-400 cursor-not-allowed'
              : 'hover:bg-blue-300/80 text-gray-700'
          }`}
          title="Start recording"
        >
          <Mic strokeWidth={1.5} />
        </button>
        <button
          onClick={() => setTranscript('')}
          disabled={!transcript}
          className={`p-2 rounded-full transition-colors ${
            transcript
              ? 'hover:bg-blue-300/80 text-gray-700'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Clear transcript"
        >
          <RotateCcw strokeWidth={1.5} />
        </button>
      </div>
    </>
  );
};

export default Convert;
