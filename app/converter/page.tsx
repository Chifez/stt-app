import Convert from '@/components/convert';
import { AudioFileProvider } from '@/lib/utils/context/audiofilecontext/useAudioFile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voice to Text Converter - Real-time Speech Recognition',
  description:
    'Convert your voice to text in real-time with Convertly. Start speaking and see instant transcription results.',
  keywords: [
    'voice to text converter',
    'speech recognition',
    'real-time transcription',
    'voice notes',
    'dictation',
  ],
  openGraph: {
    title: 'Voice to Text Converter - Real-time Speech Recognition',
    description: 'Convert your voice to text in real-time with Convertly.',
    url: 'https://convertly.com/converter',
  },
  twitter: {
    title: 'Voice to Text Converter - Real-time Speech Recognition',
    description: 'Convert your voice to text in real-time with Convertly.',
  },
  alternates: {
    canonical: 'https://convertly.com/converter',
  },
};

export default function ConverterPage() {
  return (
    <AudioFileProvider>
      <Convert />
    </AudioFileProvider>
  );
}
