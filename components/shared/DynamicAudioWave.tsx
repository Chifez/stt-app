'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

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
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const staticIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [audioData, setAudioData] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 0)
  );

  const setupAudioContext = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;

      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      microphoneRef.current.connect(analyserRef.current);

      return true;
    } catch (error) {
      console.error('Error setting up audio context:', error);
      return false;
    }
  }, []);

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    const step = Math.floor(bufferLength / barCount);
    const newAudioData: number[] = [];

    for (let i = 0; i < barCount; i++) {
      const start = i * step;
      const end = Math.min(start + step, bufferLength);
      let sum = 0;

      for (let j = start; j < end; j++) {
        sum += dataArray[j];
      }

      const average = sum / (end - start);
      const normalized = Math.min(average / 255, 1);
      const scaled = Math.pow(normalized, 0.6);

      newAudioData.push(scaled);
    }

    setAudioData(newAudioData);
    animationRef.current = requestAnimationFrame(analyzeAudio);
  }, [barCount]);

  const startStaticAnimation = useCallback(() => {
    const animate = () => {
      const time = Date.now() * 0.001;
      const staticData = Array.from({ length: barCount }, (_, i) => {
        const wave = Math.sin(time + i * 0.2) * 0.1 + 0.1;
        return Math.max(0.05, wave);
      });
      setAudioData(staticData);
    };

    staticIntervalRef.current = setInterval(animate, 50);
  }, [barCount]);

  const drawVisualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and setup canvas
    ctx.clearRect(0, 0, width, height);
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = color;

    // Draw bars
    const barWidth = width / barCount;
    const maxBarHeight = height * 0.8;
    const minBarHeight = 2;

    audioData.forEach((amplitude, index) => {
      const barHeight = Math.max(minBarHeight, amplitude * maxBarHeight);
      const x = index * barWidth;
      const y = (height - barHeight) / 2;
      const radius = Math.min(barWidth / 4, 2);

      ctx.beginPath();
      if ('roundRect' in ctx && typeof (ctx as any).roundRect === 'function') {
        (ctx as any).roundRect(x + 1, y, barWidth - 2, barHeight, radius);
      } else {
        ctx.rect(x + 1, y, barWidth - 2, barHeight);
      }
      ctx.fill();
    });
  }, [width, height, barCount, color, audioData]);

  // Single useEffect to handle everything
  useEffect(() => {
    // Always draw the current state
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      // Stop static animation interval
      if (staticIntervalRef.current) {
        clearInterval(staticIntervalRef.current);
        staticIntervalRef.current = null;
      }

      // Stop microphone stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // Disconnect audio nodes
      if (microphoneRef.current) {
        microphoneRef.current.disconnect();
        microphoneRef.current = null;
      }

      // Close audio context
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== 'closed'
      ) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [
    isListening,
    setupAudioContext,
    analyzeAudio,
    startStaticAnimation,
    drawVisualization,
  ]);

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
