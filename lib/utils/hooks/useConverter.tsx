import { useRef, useState } from 'react';

const useConverter = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setisListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const recongitionRef = useRef(null);

  /**
   * @function convertToText
   * @description Continuously listens for speech and streams the results
   * @returns {void}
   */
  const convertToText = () => {
    if (isListening == true) return;
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recongitionRef.current = new SpeechRecognition();

      if (recongitionRef.current) {
        recongitionRef.current.continuous = true;
        recongitionRef.current.interimResults = true;

        recongitionRef.current.onresult = (event: {
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

        recongitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setTranscript((prev) => prev + ' (Error occurred)');
        };

        recongitionRef.current.start();
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
      recongitionRef.current.stop();
    }
    setisListening(false);
  };

  const convertToSpeech = (text: string, id: string) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    let wordIndex = 0;

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
      setIsSpeaking(false);
      setSpeakingId(null);
      setSpeakingIndex(0);
    };

    window.speechSynthesis.speak(utterance);
  };

  return {
    transcript,
    interimTranscript,
    setTranscript,
    isListening,
    setisListening,
    stopListening,
    convertToText,
    convertToSpeech,
    isSpeaking,
    speakingIndex,
    speakingId,
  };
};
export default useConverter;
