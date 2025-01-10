'use client';
import Layout from '@/components/shared/Layout';
import { createContext, ReactNode, useContext, useState } from 'react';

interface AudioContextProps {
  audioFile: File | null;
  setAudioFile: (file: File | null) => void;
}

const AudioFileContext = createContext<AudioContextProps | null>(null);

export const useAudioContext = () => {
  const context = useContext(AudioFileContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};

export const AudioFileProvider = ({ children }: { children: ReactNode }) => {
  const [audioFile, setAudioFile] = useState<File | null>(null);

  return (
    <AudioFileContext.Provider value={{ audioFile, setAudioFile }}>
      <Layout>{children}</Layout>
    </AudioFileContext.Provider>
  );
};
