'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Advertisement } from '@/types/advertisement';

interface CarouselBannerProps {
    ads: Advertisement[];
}

export function CarouselBanner({ ads }: CarouselBannerProps) {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

    if (!ads || ads.length === 0) return null;

    return (
        <div className="overflow-hidden max-w-2xl mx-auto sm:mt-4 mb-0 sm:mb-6 relative z-10" ref={emblaRef}>
            <div className="flex">
                {ads.map((ad) => (
                    <div key={ad.id} className="flex-[0_0_100%] min-w-0">
                        <div className="bg-white border-y sm:border border-surface-200 shadow-sm flex items-stretch min-h-[88px] overflow-hidden">
                            {ad.image_url && (
                                <div className="relative w-[88px] sm:w-[100px] flex-shrink-0 bg-surface-100">
                                    <Image src={ad.image_url} alt={ad.title} fill sizes="100px" className="object-cover" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0 flex items-center gap-4 px-4 sm:px-5 py-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-display font-bold text-surface-900 leading-tight truncate text-sm sm:text-base">{ad.title}</p>
                                    {ad.subtitle && (
                                        <p className="text-xs sm:text-sm text-surface-500 leading-tight truncate mt-1">{ad.subtitle}</p>
                                    )}
                                </div>
                                {ad.link && (
                                    <a
                                        href={ad.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-black text-white text-xs sm:text-sm font-bold py-2.5 px-5 sm:px-6 rounded-full whitespace-nowrap hover:bg-surface-800 transition-colors"
                                    >
                                        {ad.button_text || 'Ver mais'}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
