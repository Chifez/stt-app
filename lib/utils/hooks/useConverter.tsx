import { useRef, useState } from 'react';

const useConverter = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setisListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');

  const recongitionRef = useRef(null);

  /**
   * @function convertToText
   * @description Continuously listens for speech and streams the results
   * @returns {void}
   */
  const convertToText = () => {
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

  return {
    transcript,
    interimTranscript,
    setTranscript,
    isListening,
    setisListening,
    stopListening,
    convertToText,
  };
};
export default useConverter;
