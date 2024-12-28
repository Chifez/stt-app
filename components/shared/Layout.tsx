'use client';

import { ChevronLeftIcon, Mic, NotepadText, Podcast } from 'lucide-react';
import useConverter from '@/lib/utils/hooks/useConverter';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
          <Link href="/converter" className="cursor-pointer">
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
