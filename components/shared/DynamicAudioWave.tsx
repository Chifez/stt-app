// 'use client';

// import React, { useRef, useEffect, useState } from 'react';

// interface DynamicAudioWaveProps {
//   isListening: boolean;
//   width?: number;
//   height?: number;
//   barCount?: number;
//   color?: string;
// }

// export const DynamicAudioWave = ({
//   isListening,
//   width = 220,
//   height = 40,
//   barCount = 32,
//   color = 'currentColor',
// }: DynamicAudioWaveProps) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   const audioRefs = useRef({
//     animationFrame: null as number | null,
//     audioContext: null as AudioContext | null,
//     analyser: null as AnalyserNode | null,
//     microphone: null as MediaStreamAudioSourceNode | null,
//     stream: null as MediaStream | null,
//     staticInterval: null as NodeJS.Timeout | null,
//   });

//   const drawVisualization = (data: number[]) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     ctx.clearRect(0, 0, width, height);
//     ctx.fillStyle = color;

//     const barWidth = width / barCount;

//     data.forEach((value, index) => {
//       const barHeight = (value / 255) * height * 0.8;
//       const x = index * barWidth;
//       const y = (height - barHeight) / 2;
//       ctx.fillRect(x, y, barWidth * 0.8, barHeight);
//     });
//   };

//   const analyzeAudio = () => {
//     const refs = audioRefs.current;
//     if (!refs.analyser) return;

//     const bufferLength = refs.analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);
//     refs.analyser.getByteFrequencyData(dataArray);

//     const step = Math.floor(bufferLength / barCount);
//     const newAudioData = Array.from({ length: barCount }, (_, i) => {
//       const slice = dataArray.slice(i * step, (i + 1) * step);
//       return slice.reduce((sum, value) => sum + value, 0) / slice.length;
//     });

//     drawVisualization(newAudioData);

//     refs.animationFrame = requestAnimationFrame(analyzeAudio);
//   };

//   const setupAudioContext = async () => {
//     const refs = audioRefs.current;
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//         },
//       });
//       refs.stream = stream;

//       refs.audioContext = new (window.AudioContext ||
//         (window as any).webkitAudioContext)();
//       refs.analyser = refs.audioContext.createAnalyser();
//       refs.analyser.fftSize = 256;
//       refs.analyser.smoothingTimeConstant = 0.8;

//       refs.microphone = refs.audioContext.createMediaStreamSource(stream);
//       refs.microphone.connect(refs.analyser);

//       analyzeAudio();
//     } catch (err) {
//       console.error('Error initializing audio:', err);
//     }
//   };

//   const startStaticAnimation = () => {
//     const refs = audioRefs.current;
//     refs.staticInterval = setInterval(() => {
//       if (!isListening) {
//         const center = barCount / 2;
//         const newData = Array.from({ length: barCount }, (_, i) => {
//           const distance = Math.abs(i - center) / center;
//           const baseHeight = 20 - distance * 15;
//           const variation = Math.sin(Date.now() * 0.003 + i * 0.5) * 5;
//           return Math.max(0, baseHeight + variation);
//         });

//         drawVisualization(newData);
//       }
//     }, 50);
//   };

//   useEffect(() => {
//     const refs = audioRefs.current;

//     if (isListening) {
//       setupAudioContext();
//     } else {
//       startStaticAnimation();
//     }

//     return () => {
//       if (refs.animationFrame) cancelAnimationFrame(refs.animationFrame);
//       if (refs.staticInterval) clearInterval(refs.staticInterval);
//       if (refs.microphone) refs.microphone.disconnect();
//       if (refs.audioContext && refs.audioContext.state !== 'closed') {
//         refs.audioContext.close();
//       }
//       if (refs.stream) {
//         refs.stream.getTracks().forEach((t) => t.stop());
//       }

//       refs.animationFrame = null;
//       refs.audioContext = null;
//       refs.analyser = null;
//       refs.microphone = null;
//       refs.stream = null;
//       refs.staticInterval = null;
//     };
//   }, [isListening, barCount, width, height, color]);

//   return (
//     <div className="flex items-center justify-center">
//       <canvas
//         ref={canvasRef}
//         width={width}
//         height={height}
//         className="opacity-80"
//         style={{ width: `${width}px`, height: `${height}px` }}
//       />
//     </div>
//   );
// };

'use client';

import React, { useRef, useEffect } from 'react';

interface DynamicAudioWaveProps {
  isListening: boolean;
  width?: number;
  height?: number;
  color?: string;
}

export const DynamicAudioWave = ({
  isListening,
  width = 220,
  height = 40,
  color = 'currentColor',
}: DynamicAudioWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const barWidth = 1.5;
  const gap = 3.5;
  const barCount = Math.floor((width - 10) / (barWidth + gap)); // fit as many bars as possible

  const audioRefs = useRef({
    animationFrame: null as number | null,
    audioContext: null as AudioContext | null,
    analyser: null as AnalyserNode | null,
    microphone: null as MediaStreamAudioSourceNode | null,
    stream: null as MediaStream | null,
    staticInterval: null as NodeJS.Timeout | null,
  });

  const drawVisualization = (data: number[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = color;

    data.forEach((value, index) => {
      const x = 10 + index * (barWidth + gap);
      const barHeight = (value / 255) * height * 0.8;
      const y = (height - barHeight) / 2;
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  };

  const analyzeAudio = () => {
    const refs = audioRefs.current;
    if (!refs.analyser) return;

    const bufferLength = refs.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    refs.analyser.getByteFrequencyData(dataArray);

    const step = Math.floor(bufferLength / barCount);
    const newAudioData = Array.from({ length: barCount }, (_, i) => {
      const slice = dataArray.slice(i * step, (i + 1) * step);
      return slice.reduce((sum, value) => sum + value, 0) / slice.length;
    });

    drawVisualization(newAudioData);

    refs.animationFrame = requestAnimationFrame(analyzeAudio);
  };

  const setupAudioContext = async () => {
    const refs = audioRefs.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      refs.stream = stream;

      refs.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      refs.analyser = refs.audioContext.createAnalyser();
      refs.analyser.fftSize = 256;
      refs.analyser.smoothingTimeConstant = 0.8;

      refs.microphone = refs.audioContext.createMediaStreamSource(stream);
      refs.microphone.connect(refs.analyser);

      analyzeAudio();
    } catch (err) {
      console.error('Error initializing audio:', err);
    }
  };

  const startStaticAnimation = () => {
    const refs = audioRefs.current;
    refs.staticInterval = setInterval(() => {
      if (!isListening) {
        const center = barCount / 2;
        const newData = Array.from({ length: barCount }, (_, i) => {
          const distance = Math.abs(i - center) / center;
          const baseHeight = 20 - distance * 15;
          const variation = 0; // no animation when static
          return Math.max(0, baseHeight + variation);
        });

        drawVisualization(newData);
      }
    }, 500); // update occasionally, but it stays still
  };

  useEffect(() => {
    const refs = audioRefs.current;

    if (isListening) {
      setupAudioContext();
    } else {
      startStaticAnimation();
    }

    return () => {
      if (refs.animationFrame) cancelAnimationFrame(refs.animationFrame);
      if (refs.staticInterval) clearInterval(refs.staticInterval);
      if (refs.microphone) refs.microphone.disconnect();
      if (refs.audioContext && refs.audioContext.state !== 'closed') {
        refs.audioContext.close();
      }
      if (refs.stream) {
        refs.stream.getTracks().forEach((t) => t.stop());
      }

      refs.animationFrame = null;
      refs.audioContext = null;
      refs.analyser = null;
      refs.microphone = null;
      refs.stream = null;
      refs.staticInterval = null;
    };
  }, [isListening, width, height, color]);

  return (
    <div className="flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="opacity-80"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    </div>
  );
};
