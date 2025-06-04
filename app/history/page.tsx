import Layout from '@/components/shared/Layout';
import HistoryPage from '@/components/history';
import { AudioFileProvider } from '@/lib/utils/context/audiofilecontext/useAudioFile';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transcript History - Manage Your Saved Voice Transcriptions',
  description:
    'View, edit, and manage all your saved voice transcriptions. Search through your transcript history and organize your voice notes.',
  keywords: [
    'transcript history',
    'saved transcriptions',
    'voice notes management',
    'transcript search',
    'voice recordings',
  ],
  openGraph: {
    title: 'Transcript History - Manage Your Saved Voice Transcriptions',
    description: 'View, edit, and manage all your saved voice transcriptions.',
    url: 'https://convertly.com/history',
  },
  twitter: {
    title: 'Transcript History - Manage Your Saved Voice Transcriptions',
    description: 'View, edit, and manage all your saved voice transcriptions.',
  },
  alternates: {
    canonical: 'https://convertly.com/history',
  },
};

export default function History() {
  return (
    <AudioFileProvider>
      <HistoryPage />
    </AudioFileProvider>
  );
}
