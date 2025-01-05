import Convert from '@/components/convert';
import { AudioFileProvider } from '@/lib/utils/context/audiofilecontext/useAudioFile';

export default function ConverterPage() {
  return (
    <AudioFileProvider>
      <Convert />
    </AudioFileProvider>
  );
}
