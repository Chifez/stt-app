import { useRef, useState, useCallback, useEffect } from 'react';
import { useAudioContext } from '../context/audiofilecontext/useAudioFile';

const useConverter = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isRecognitionReady, setIsRecognitionReady] = useState(false);

  // Consolidate speech synthesis state
  const [speechState, setSpeechState] = useState({
    isSpeaking: false,
    speakingIndex: 0,
    speakingId: null as string | null,
  });

  const { audioFile, setAudioFile } = useAudioContext();
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptAccumulatorRef = useRef('');
  const manuallyStoppedRef = useRef(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    manuallyStoppedRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        // Don't destroy the recognition instance, just stop it
        // Keep it ready for next recording session
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsListening(false);
    setIsLoading(false);
    setInterimTranscript('');
  }, []);

  // Single useEffect for initialization and cleanup
  useEffect(() => {
    // Check browser support on mount
    const checkSupport = () => {
      const supported = !!(
        window.SpeechRecognition || window.webkitSpeechRecognition
      );
      setIsSupported(supported);
      if (!supported) {
        setError(
          'Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.'
        );
      }
    };

    checkSupport();

    // Return cleanup function for unmount
    return cleanup;
  }, [cleanup]);

  const processAudioFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      await new Promise((resolve, reject) => {
        reader.onload = () => {
          const audioBuffer = reader.result;
          console.log('Audio buffer:', audioBuffer);
          // TODO: Add actual audio processing logic here
          resolve(audioBuffer);
        };
        reader.onerror = () => reject(new Error('Failed to read audio file'));
      });

      setTranscript(
        'Audio file processing is not yet implemented. Please use voice recording instead.'
      );
    } catch (error) {
      console.error('Failed to process audio file:', error);
      setError('Failed to process audio file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-initialize speech recognition when microphone access is granted
  const initializeSpeechRecognition = useCallback(() => {
    if (!isSupported || recognitionRef.current) {
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Configure recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      let restartCount = 0;
      const maxRestarts = 3;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setIsLoading(false);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let currentInterim = '';

        try {
          // Only process new results from the latest speech recognition event
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;

            if (result.isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              currentInterim += transcript + ' ';
            }
          }

          if (finalTranscript) {
            finalTranscriptAccumulatorRef.current += finalTranscript;
            setTranscript(finalTranscriptAccumulatorRef.current.trim());
            setInterimTranscript('');
          }

          if (currentInterim) {
            setInterimTranscript(currentInterim.trim());
          }
        } catch (error) {
          console.error('Error processing speech results:', error);
          setError('Error processing speech. Please try again.');
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);

        switch (event.error) {
          case 'no-speech':
            setError('No speech detected. Please try speaking again.');
            break;
          case 'audio-capture':
            setError('Audio capture failed. Please check your microphone.');
            break;
          case 'not-allowed':
            setError(
              'Microphone access denied. Please allow microphone access.'
            );
            break;
          case 'network':
            setError('Network error. Please check your internet connection.');
            break;
          case 'aborted':
            // Intentional abort, don't show error
            break;
          default:
            setError(`Speech recognition error: ${event.error}`);
        }

        cleanup();
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');

        // Only auto-restart if still supposed to be listening, not manually stopped, and under restart limit
        if (
          isListening &&
          !manuallyStoppedRef.current &&
          restartCount < maxRestarts
        ) {
          restartCount++;
          console.log(
            `Restarting speech recognition (attempt ${restartCount})`
          );

          timeoutRef.current = setTimeout(() => {
            if (
              recognitionRef.current &&
              isListening &&
              !manuallyStoppedRef.current
            ) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Failed to restart recognition:', error);
                cleanup();
              }
            }
          }, 100);
        } else {
          // If manually stopped or reached max restarts, just update listening state
          setIsListening(false);
        }
      };

      setIsRecognitionReady(true);
      console.log('Speech recognition pre-initialized and ready');
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setError('Failed to initialize speech recognition. Please try again.');
    }
  }, [isSupported]);

  /**
   * @function convertToText
   * @description Starts listening for speech immediately (no initialization delay)
   * @returns {void}
   */
  const convertToText = useCallback(async () => {
    // Prevent multiple instances
    if (isListening || isLoading) {
      console.warn('Speech recognition is already active');
      return;
    }

    // Check if recognition is ready
    if (!isRecognitionReady || !recognitionRef.current) {
      setError('Speech recognition not ready. Please try again.');
      return;
    }

    setError(null);
    manuallyStoppedRef.current = false; // Reset manual stop flag

    // Handle audio file processing
    if (audioFile) {
      setIsLoading(true);
      await processAudioFile(audioFile);
      setAudioFile(null);
      return;
    }

    // Reset transcript accumulator for new session
    finalTranscriptAccumulatorRef.current = '';

    try {
      // Start listening immediately - no initialization needed
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setError('Failed to start speech recognition. Please try again.');
    }
  }, [isListening, isLoading, isRecognitionReady, audioFile, setAudioFile]);

  /**
   * @function stopListening
   * @description Stops the speech recognition and updates the listening state
   * @returns {void}
   */
  const stopListening = useCallback(() => {
    console.log('Stopping speech recognition');
    cleanup();
  }, [cleanup]);

  const convertToSpeech = useCallback(
    (text: string, id: string) => {
      if (!text) {
        setError('No text to convert to speech');
        return;
      }

      // Check browser support
      if (!window.speechSynthesis) {
        setError('Speech synthesis not supported in your browser');
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const resetStates = () => {
        setSpeechState({
          isSpeaking: false,
          speakingIndex: 0,
          speakingId: null,
        });
      };

      // If already speaking the same text, just stop
      if (speechState.isSpeaking && speechState.speakingId === id) {
        resetStates();
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(text);
        let wordIndex = 0;

        // Configure utterance
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Clean up function for event listeners
        const cleanupSpeech = () => {
          utterance.onboundary = null;
          utterance.onstart = null;
          utterance.onend = null;
          utterance.onerror = null;
        };

        utterance.onboundary = (event) => {
          if (event.name === 'word') {
            setSpeechState((prev) => ({
              ...prev,
              speakingIndex: wordIndex,
            }));
            wordIndex++;
          }
        };

        utterance.onstart = () => {
          setSpeechState((prev) => ({
            ...prev,
            isSpeaking: true,
            speakingId: id,
            speakingIndex: 0,
          }));
          setError(null);
        };

        utterance.onend = () => {
          resetStates();
          cleanupSpeech();
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setError('Failed to play speech. Please try again.');
          resetStates();
          cleanupSpeech();
        };

        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Failed to start speech synthesis:', error);
        setError('Failed to start speech synthesis');
        resetStates();
      }
    },
    [speechState]
  );

  return {
    transcript,
    interimTranscript,
    isListening,
    isSpeaking: speechState.isSpeaking,
    speakingIndex: speechState.speakingIndex,
    speakingId: speechState.speakingId,
    isLoading,
    error,
    isSupported,
    isRecognitionReady,
    setTranscript,
    setIsListening,
    stopListening,
    convertToText,
    convertToSpeech,
    setAudioFile,
    initializeSpeechRecognition,
    clearError: () => setError(null),
  };
};

export default useConverter;
