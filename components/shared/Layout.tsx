'use client';

import {
  ChevronLeftIcon,
  LogOut,
  Mic,
  NotepadText,
  Podcast,
} from 'lucide-react';
import useConverter from '@/lib/utils/hooks/useConverter';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAudioContext } from '@/lib/utils/context/audiofilecontext/useAudioFile';
import { useGetProfile } from '@/lib/utils/hooks/useUserProfile';
import { toast } from 'sonner';
import { buildApiUrl } from '@/lib/utils/functions/helpers';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { setAudioFile } = useAudioContext();
  const { convertToText: onListening } = useConverter();
  const { data } = useGetProfile();
  const router = useRouter();
  const pathname = usePathname();

  const goToConverter = () => {
    if (pathname !== '/converter') {
      router.push('/converter');
    }
    onListening();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(buildApiUrl('/api/auth/logout'));
      if (!response.ok) {
        toast.error('Failed to logout. Please try again.');
        return;
      }
      toast.success('Logout successful');
      router.push('/auth/login');
    } catch (error) {
      toast.error('Network error during logout.');
    }
  };

  const getAudioFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';

    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (file) {
        setAudioFile(file);
      }
    };
    input.click();
  };

  return (
    <div className="w-full px-4 md:w-[70%] py-10 mx-auto space-y-8">
      <p>Hello, {data?.profile.name || 'There'}</p>
      <nav className="flex items-center justify-between">
        <div
          className="flex items-center justify-center gap-1 cursor-pointer"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon />
          Back
        </div>

        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="cursor-pointer">
            <LogOut strokeWidth={1.25} />
          </button>

          {/* <Link
            href="/converter"
            className="cursor-pointer"
            onClick={getAudioFile}
          >
            <Podcast strokeWidth={1.25} />
          </Link> */}
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
