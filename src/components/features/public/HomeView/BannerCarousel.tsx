'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

const AUTOPLAY_DELAY = 8000;

const slides = [
  { src: '/clinica.png',  alt: 'CliniVet clínica'  },
  { src: '/mascotes.png', alt: 'CliniVet mascotes'  },
];

export function BannerCarousel() {
  const [api, setApi] = useState<CarouselApi | null>(null);

  const handleSetApi = useCallback((newApi: CarouselApi) => {
    setApi(newApi);
  }, []);

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), AUTOPLAY_DELAY);
    return () => clearInterval(interval);
  }, [api]);

  return (
    <Carousel
      opts={{ loop: true, duration: 60 }}
      setApi={handleSetApi}
      className="w-full"
    >
      <CarouselContent className="ml-0">
        {slides.map((slide, i) => (
          <CarouselItem key={i} className="pl-0">
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full max-h-[500px] object-cover object-center"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 bg-black/30 hover:bg-black/50 text-white border-none" />
      <CarouselNext className="right-4 bg-black/30 hover:bg-black/50 text-white border-none" />
    </Carousel>
  );
}
