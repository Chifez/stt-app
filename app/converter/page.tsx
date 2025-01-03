import Layout from '@/components/shared/Layout';
import Convert from '@/components/convert';
import { AudioFileProvider } from '@/lib/utils/context/audiofilecontext/useAudioFile';

export default function ConverterPage() {
  return (
    <AudioFileProvider>
      <Convert />
    </AudioFileProvider>
  );
}
