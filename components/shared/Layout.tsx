'use client';

import { ChevronLeftIcon, Mic, NotepadText, Podcast } from 'lucide-react';
import useConverter from '@/lib/utils/hooks/useConverter';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { useAudioContext } from '@/lib/utils/context/audiofilecontext/useAudioFile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { setAudioFile } = useAudioContext();

  const { convertToText: onListening } = useConverter();
  const router = useRouter();
  const pathname = usePathname();

  const goToConverter = () => {
    if (pathname !== '/converter') {
      // Navigate to the converter page if not already there
      router.push('/converter');
    }
    // Call the onListening function
    onListening();
  };

  const getAudioFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';

    input.onchange = async (event: any) => {
      const file = event.target.Files[0];
      // const audioBlob =  new Blob([file], {type:file.type})
      setAudioFile(file);
    };
    input.click();
  };

  useEffect(() => {
    if (pathname == '/converter') {
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            console.log('microphone has been connected');
          })
          .catch(() => {
            alert('you need to enable your microphone');
          });
      } else {
        alert('SpeechAPI isnt supported');
      }
    }
  }, [pathname]);

  return (
    <div className="w-full px-4 md:w-[70%] py-10 mx-auto space-y-8">
      <nav className="flex items-center justify-between">
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon />
          Back
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/converter"
            className="cursor-pointer"
            onClick={getAudioFile}
          >
            <Podcast strokeWidth={1.25} />
          </Link>
          <Link href="/converter" className="cursor-pointer">
            <Mic strokeWidth={1.25} />
          </Link>
          {/* <button onClick={goToConverter} className="cursor-pointer">
            <Mic strokeWidth={1.25} />
          </button> */}
          <Link href="/history" className="cursor-pointer">
            <NotepadText strokeWidth={1.25} />
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
