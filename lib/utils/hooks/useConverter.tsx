import { useRef, useState, useCallback, useEffect } from 'react';
import { useAudioContext } from '../context/audiofilecontext/useAudioFile';

const useConverter = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const { audioFile, setAudioFile } = useAudioContext();
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support on mount
  useEffect(() => {
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
  }, []);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
      } catch (error) {
        console.warn('Error during cleanup:', error);
      }
      recognitionRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsListening(false);
    setIsLoading(false);
    setInterimTranscript('');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
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

  /**
   * @function convertToText
   * @description Continuously listens for speech and streams the results with improved error handling
   * @returns {void}
   */
  const convertToText = useCallback(async () => {
    // Prevent multiple instances
    if (isListening || isLoading) {
      console.warn('Speech recognition is already active');
      return;
    }

    // Check browser support
    if (!isSupported) {
      setError('Speech recognition is not supported in your browser');
      return;
    }

    setError(null);
    setIsLoading(true);

    // Handle audio file processing
    if (audioFile) {
      await processAudioFile(audioFile);
      setAudioFile(null);
      return;
    }

    // Check microphone permissions
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (permissionError) {
      setError(
        'Microphone access denied. Please allow microphone access and try again.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      // Cleanup any existing recognition
      cleanup();

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Configure recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      let finalTranscriptAccumulator = '';
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
          Array.from(event.results).forEach((result: any) => {
            const transcript = result[0].transcript;
            if (result.isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              currentInterim += transcript + ' ';
            }
          });

          if (finalTranscript) {
            finalTranscriptAccumulator += finalTranscript;
            setTranscript(finalTranscriptAccumulator.trim());
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

        // Auto-restart if still supposed to be listening and not manually stopped
        if (isListening && restartCount < maxRestarts) {
          restartCount++;
          console.log(
            `Restarting speech recognition (attempt ${restartCount})`
          );

          timeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && isListening) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.error('Failed to restart recognition:', error);
                cleanup();
              }
            }
          }, 100);
        } else {
          cleanup();
        }
      };

      recognition.start();
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      setError('Failed to start speech recognition. Please try again.');
      cleanup();
    }
  }, [isListening, isLoading, isSupported, audioFile, setAudioFile, cleanup]);

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
        setIsSpeaking(false);
        setSpeakingId(null);
        setSpeakingIndex(0);
      };

      // If already speaking the same text, just stop
      if (isSpeaking && speakingId === id) {
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
            setSpeakingIndex(wordIndex);
            wordIndex++;
          }
        };

        utterance.onstart = () => {
          setIsSpeaking(true);
          setSpeakingId(id);
          setSpeakingIndex(0);
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
    [isSpeaking, speakingId]
  );

  return {
    transcript,
    interimTranscript,
    isListening,
    isSpeaking,
    speakingIndex,
    speakingId,
    isLoading,
    error,
    isSupported,
    setTranscript,
    setIsListening,
    stopListening,
    convertToText,
    convertToSpeech,
    setAudioFile,
    clearError: () => setError(null),
  };
};

export default useConverter;
