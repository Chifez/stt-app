'use client';

import React, { useRef, useEffect, useState } from 'react';

interface DynamicAudioWaveProps {
  isListening: boolean;
  width?: number;
  height?: number;
  barCount?: number;
  color?: string;
}

export const DynamicAudioWave = ({
  isListening,
  width = 220,
  height = 40,
  barCount = 32,
  color = 'currentColor',
}: DynamicAudioWaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Consolidate all audio-related refs into a single object
  const audioRefs = useRef({
    animationFrame: null as number | null,
    audioContext: null as AudioContext | null,
    analyser: null as AnalyserNode | null,
    microphone: null as MediaStreamAudioSourceNode | null,
    stream: null as MediaStream | null,
    staticInterval: null as NodeJS.Timeout | null,
  });

  const [audioData, setAudioData] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 0)
  );

  useEffect(() => {
    const refs = audioRefs.current;

    const drawVisualization = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Set color
      ctx.fillStyle = color;

      const barWidth = width / barCount;

      // Draw frequency bars
      audioData.forEach((value, index) => {
        const barHeight = (value / 255) * height * 0.8;
        const x = index * barWidth;
        const y = (height - barHeight) / 2;

        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
      });
    };

    const setupAudioContext = async () => {
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

        return true;
      } catch (error) {
        console.error('Error setting up audio context:', error);
        return false;
      }
    };

    const analyzeAudio = () => {
      if (!refs.analyser) return;

      const bufferLength = refs.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      refs.analyser.getByteFrequencyData(dataArray);

      // Sample data for visualization
      const step = Math.floor(bufferLength / barCount);
      const newAudioData = Array.from({ length: barCount }, (_, i) => {
        const start = i * step;
        const end = start + step;
        const slice = dataArray.slice(start, end);
        return slice.reduce((sum, value) => sum + value, 0) / slice.length;
      });

      setAudioData(newAudioData);
      drawVisualization();

      if (isListening) {
        refs.animationFrame = requestAnimationFrame(analyzeAudio);
      }
    };

    const startStaticAnimation = () => {
      refs.staticInterval = setInterval(() => {
        if (!isListening) {
          // Generate subtle breathing animation
          const newData = Array.from({ length: barCount }, (_, i) => {
            const center = barCount / 2;
            const distance = Math.abs(i - center) / center;
            const baseHeight = 20 - distance * 15;
            const variation = Math.sin(Date.now() * 0.003 + i * 0.5) * 5;
            return Math.max(0, baseHeight + variation);
          });
          setAudioData(newData);
          drawVisualization();
        }
      }, 50);
    };

    // Main effect logic
    drawVisualization();

    if (isListening) {
      setupAudioContext().then((success) => {
        if (success) {
          analyzeAudio();
        }
      });
    } else {
      startStaticAnimation();
    }

    // Cleanup function
    return () => {
      // Stop animation frame
      if (refs.animationFrame) {
        cancelAnimationFrame(refs.animationFrame);
        refs.animationFrame = null;
      }

      // Stop static animation interval
      if (refs.staticInterval) {
        clearInterval(refs.staticInterval);
        refs.staticInterval = null;
      }

      // Stop microphone stream
      if (refs.stream) {
        refs.stream.getTracks().forEach((track) => track.stop());
        refs.stream = null;
      }

      // Disconnect audio nodes
      if (refs.microphone) {
        refs.microphone.disconnect();
        refs.microphone = null;
      }

      // Close audio context
      if (refs.audioContext && refs.audioContext.state !== 'closed') {
        refs.audioContext.close();
        refs.audioContext = null;
      }
    };
  }, [isListening, audioData, barCount, width, height, color]);

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
