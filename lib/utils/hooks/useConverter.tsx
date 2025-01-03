import { useRef, useState } from 'react';
import { useAudioContext } from '../context/audiofilecontext/useAudioFile';

const useConverter = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setisListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  // const [audioFile, setAudioFile] = useState<File | null>(null);

  const { audioFile, setAudioFile } = useAudioContext();

  const recongitionRef = useRef(null);

  const processAudioFile = async (file: File) => {
    // Example of processing the audio file
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const audioBuffer = reader.result;
      // Add audio processing logic here (e.g., transcribe or analyze the audio)
      console.log('Audio buffer:', audioBuffer);
    };
    reader.onerror = (error) => {
      console.error('Failed to read file:', error);
    };
  };

  /**
   * @function convertToText
   * @description Continuously listens for speech and streams the results
   * @returns {void}
   */
  const convertToText = async () => {
    if (isListening == true) return;
    if (audioFile) {
      // Process the selected audio file
      await processAudioFile(audioFile);
      setAudioFile(null); // Clear the file after processing
      return;
    }

    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recongitionRef.current = new SpeechRecognition();

      const recongition = recongitionRef.current as any;

      if (recongition) {
        recongition.continuous = true;
        recongition.interimResults = true;

        recongition.onresult = (event: {
          results: Iterable<unknown> | ArrayLike<unknown>;
        }) => {
          let finalTranscript = '';
          let currentInterim = '';

          Array.from(event.results).forEach((result: any) => {
            if (result.isFinal) {
              finalTranscript += result[0].transcript + ' ';
            } else {
              currentInterim += result[0].transcript + ' ';
            }
          });

          if (finalTranscript) {
            setTranscript(finalTranscript);
            setInterimTranscript('');
          }
          if (currentInterim) {
            setInterimTranscript(currentInterim);
          }
        };

        recongition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setTranscript((prev) => prev + ' (Error occurred)');
        };

        recongition.start();
        setisListening(true);
      }
    } else {
      setTranscript('Browser does not support speech recognition');
    }
  };

  /**
   * @function stopListening
   * @description stops the speech recognition and updates the listening state
   * @returns {void}
   */
  const stopListening = () => {
    if (recongitionRef.current) {
      (recongitionRef.current as any).stop();
    }
    setisListening(false);
  };

  const convertToSpeech = (text: string, id: string) => {
    if (!text) return;

    // Check browser support
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const resetStates = () => {
      setIsSpeaking(false);
      setSpeakingId(null);
      setSpeakingIndex(0);
    };

    // If already speaking, just stop
    if (isSpeaking) {
      resetStates();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    let wordIndex = 0;

    // Clean up function for event listeners
    const cleanup = () => {
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
    };

    utterance.onend = () => {
      resetStates();
      cleanup();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      resetStates();
      cleanup();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Failed to start speech synthesis:', error);
      resetStates();
      cleanup();
    }
  };

  return {
    transcript,
    interimTranscript,
    isListening,
    isSpeaking,
    speakingIndex,
    speakingId,
    setTranscript,
    setisListening,
    stopListening,
    convertToText,
    convertToSpeech,
    setAudioFile,
  };
};
export default useConverter;
