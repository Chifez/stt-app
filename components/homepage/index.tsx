import Image from 'next/image';
import { ImageCarousel } from '../shared/ImageCarousel';

const HomePage = () => {
  return (
    <div className="bg-black h-screen text-white p-3 md:p-6 space-y-2 md:space-y-14 overflow-hidden">
      <div>
        <p className="font-bold">Convertly</p>
      </div>
      <div className="overflow-hidden flex items-start justify-center border rounded-r-full rounded-l-full h-[200vh] p-10 flex-1">
        <ImageCarousel />
      </div>
    </div>
  );
};

export default HomePage;
