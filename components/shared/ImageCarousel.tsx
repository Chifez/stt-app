'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import Image from 'next/image';

export function ImageCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const slides = [
    {
      title: 'Convert voice into text.',
      description:
        'Now you can easily translate your beautiful sound waves to text',
      image: '/tts-banner.png',
    },
    {
      title: 'Record voice on the go',
      description:
        'Now you can easily translate your beautiful sound waves to text',
      image: '/tts-banner.png',
    },
    {
      title: 'Scope your translations',
      description:
        'Now you can easily translate your beautiful sound waves to text',
      image: '/tts-banner.png',
    },
  ];

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs">
        <CarouselContent>
          {slides.map((items, index) => (
            <CarouselItem
              key={index}
              className="flex flex-col items-center justify-center w-full"
            >
              <>
                <div className="text-center w-[80%] md:w-full mx-auto">
                  <p className="text-3xl md:text-5xl w-[80%] md:w-full mx-auto font-semibold md:leading-[60px] text-wrap">
                    {items.title}
                  </p>
                  <p className="text-lg italic text-gray-400 font-medium">
                    {items.description}
                  </p>
                </div>
                <div className="relative w-[600px] h-[300px] ">
                  <Image src={items.image} fill alt="converter" />
                </div>
              </>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mx-auto absolute bottom-10 left-1/2 -translate-x-1/2  flex items-center justify-center gap-1">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`${
                current == index + 1 ? 'w-4' : ' w-2'
              } h-2 transition-all rounded-full bg-white`}
              onClick={() => api?.scrollTo(index)}
            ></span>
          ))}
        </div>
      </Carousel>
    </div>
  );
}
