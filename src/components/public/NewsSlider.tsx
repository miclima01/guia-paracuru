'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronRight, Clock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { NewsArticle } from '@/types';

interface NewsSliderProps {
    news: NewsArticle[];
    supportWhatsapp?: string;
}

export default function NewsSlider({ news, supportWhatsapp }: NewsSliderProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 5000, stopOnInteraction: false })]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    if (!news || news.length === 0) return null;

    // The total number of slides is news items + 1 ad slide
    const totalSlides = news.length + 1;

    return (
        <div className="relative w-full rounded-xl shadow-md border border-surface-100 overflow-hidden bg-white">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {news.map((item) => (
                        <div key={item.id} className="flex-[0_0_100%] min-w-0">
                            <Link href={`/noticias/${item.id}`} className="block relative bg-fire-700 min-h-[220px] p-6 flex flex-col justify-center text-white overflow-hidden group">
                                {/* Background Image (Optional, with overlay) */}
                                {item.image_url && (
                                    <>
                                        <div className="absolute inset-0">
                                            <Image
                                                src={item.image_url}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-fire-900/70 backdrop-blur-[1px]" />
                                    </>
                                )}

                                {!item.image_url && (
                                    <div className="absolute inset-0 carnival-gradient opacity-10" />
                                )}

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-3">
                                        {item.category === 'avisos' && (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 uppercase tracking-wider animate-pulse">
                                                <AlertCircle size={12} /> Urgente
                                            </span>
                                        )}
                                        <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-semibold text-white border border-white/10">
                                            {item.category}
                                        </span>
                                    </div>

                                    <h3 className="font-display text-xl md:text-2xl leading-tight mb-2 line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-white/80 text-xs md:text-sm line-clamp-2 mb-4 max-w-lg">
                                        {item.summary}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="flex items-center gap-1.5 text-xs text-white/60">
                                            <Clock size={12} />
                                            <span>{formatDateTime(item.published_at)}</span>
                                        </div>

                                        <span className="flex items-center gap-1 text-xs font-bold text-white hover:text-amber-300 transition-colors">
                                            Ler mais <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}

                    {/* Ad Slide */}
                    <div className="flex-[0_0_100%] min-w-0">
                        <div className="relative min-h-[220px] p-6 flex flex-col justify-center items-start text-left text-white overflow-hidden group h-full">
                            {/* Background - Green Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-500" />
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

                            <div className="relative z-10 flex flex-col items-start w-full">
                                <h3 className="font-display text-lg font-semibold text-white mt-2">Divulgue sua marca ou notícia aqui</h3>
                                <p className="text-sm text-white/70 mt-1 mb-4">Divulgue no guia oficial do Carnaval e destaque seu negócio.</p>

                                <a
                                    href={`https://wa.me/55${supportWhatsapp || '85994293148'}?text=Olá! Gostaria de anunciar no Guia Paracuru`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-600 font-bold text-sm shadow-sm group-hover:bg-surface-50 transition-colors"
                                >
                                    Anunciar agora <ArrowRight size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1.5 z-20 pointer-events-none">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                        key={idx}
                        aria-label={`Ir para o slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 pointer-events-auto ${selectedIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                            }`}
                        onClick={() => scrollTo(idx)}
                    />
                ))}
            </div>
        </div>
    );
}
