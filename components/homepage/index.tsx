import Image from 'next/image';
import { ImageCarousel } from '../shared/ImageCarousel';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="bg-black h-screen text-white p-3 md:p-6 space-y-2 md:space-y-14 overflow-hidden">
      <div className="flex items-center justify-between">
        <p className="font-bold">Convertly</p>
        <Link href="/converter" className="flex items-center gap-2">
          <p>Get started</p>
          <ArrowRight />
        </Link>
      </div>
      <div className="overflow-hidden flex items-start justify-center border rounded-r-full rounded-l-full h-[200vh] p-10 flex-1">
        <ImageCarousel />
      </div>
    </div>
  );
};

export default HomePage;
