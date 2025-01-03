import Layout from '@/components/shared/Layout';
import HistoryPage from '@/components/history';
import { AudioFileProvider } from '@/lib/utils/context/audiofilecontext/useAudioFile';

export default function History() {
  return (
    <AudioFileProvider>
      <HistoryPage />
    </AudioFileProvider>
  );
}
