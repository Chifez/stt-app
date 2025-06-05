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
import { useRef, useEffect, useState, useCallback } from 'react';

import EditableContent from '../shared/EditableContent';
import { toast } from 'sonner';
import ShareTranscript from '../shared/ShareTranscript';
import { DynamicAudioWave } from '../shared/DynamicAudioWave';

const Convert = () => {
  // Consolidate UI state into single object
  const [uiState, setUiState] = useState({
    editing: false,
    microphoneGranted: false,
  });

  const {
    transcript,
    interimTranscript,
    isListening,
    isLoading,
    error,
    isSupported,
    isRecognitionReady,
    stopListening,
    setTranscript,
    convertToText: onListening,
    initializeSpeechRecognition,
    clearError,
  } = useConverter();

  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-request microphone permission on mount
  useEffect(() => {
    const requestMicrophoneAccess = async () => {
      if (!isSupported) {
        setUiState((prev) => ({ ...prev, microphoneGranted: false }));
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setUiState((prev) => ({ ...prev, microphoneGranted: true }));
        // Stop the stream since we just needed to check permission
        stream.getTracks().forEach((track) => track.stop());

        // Pre-initialize speech recognition now that we have microphone access
        initializeSpeechRecognition();

        toast.success('Microphone access granted! Speech recognition ready.');
      } catch (error: any) {
        setUiState((prev) => ({ ...prev, microphoneGranted: false }));
        if (error.name === 'NotAllowedError') {
          toast.error('Microphone access denied', {
            description:
              'Please allow microphone access to use speech recognition',
          });
        } else if (error.name === 'NotFoundError') {
          toast.error('No microphone found', {
            description: 'Please connect a microphone and refresh the page',
          });
        } else {
          toast.error('Unable to access microphone', {
            description: 'Please check your browser settings',
          });
        }
      }
    };

    requestMicrophoneAccess();
  }, [isSupported, initializeSpeechRecognition]);

  // Autoscroll the card when transcript content changes
  const scrollCardToBottom = useCallback(() => {
    if (cardRef.current && (transcript || interimTranscript)) {
      requestAnimationFrame(() => {
        if (cardRef.current) {
          cardRef.current.scrollTop = cardRef.current.scrollHeight;
        }
      });
    }
  }, [transcript, interimTranscript]);

  // Trigger scroll when content changes
  scrollCardToBottom();

  const toggleEdit = () => {
    if (!transcript) return;
    setUiState((prev) => ({ ...prev, editing: !prev.editing }));
  };

  const handleCopy = () => {
    copyTranscript(transcript);
    toast.success('Copied successfully');
  };

  const handleStartListening = () => {
    if (!uiState.microphoneGranted || !isRecognitionReady) {
      toast.error('Speech recognition not ready', {
        description: 'Please wait for initialization to complete',
      });
      return;
    }
    clearError();
    onListening();
  };

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
        <CardContent className="flex-1 min-h-[80%] overflow-y-auto scrollbar-hide">
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
                  isEditing={uiState.editing}
                  setIsEditing={(editing) =>
                    setUiState((prev) => ({ ...prev, editing }))
                  }
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
                {uiState.microphoneGranted && isRecognitionReady
                  ? 'Click the microphone to start recording...'
                  : uiState.microphoneGranted
                  ? 'Preparing speech recognition...'
                  : 'Requesting microphone access...'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center mx-auto mb-1">
        <DynamicAudioWave isListening={isListening} />

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
          disabled={
            !isSupported ||
            !uiState.microphoneGranted ||
            !isRecognitionReady ||
            isLoading
          }
          className={`p-2 rounded-full transition-colors ${
            isSupported &&
            uiState.microphoneGranted &&
            isRecognitionReady &&
            !isLoading
              ? 'hover:bg-blue-300/80 text-gray-700'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title={
            !isSupported
              ? 'Speech recognition not supported'
              : !uiState.microphoneGranted
              ? 'Microphone access required'
              : !isRecognitionReady
              ? 'Speech recognition initializing...'
              : 'Start recording'
          }
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
