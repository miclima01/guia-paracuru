'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import type { NewsArticle } from '@/types';

interface NewsSliderProps {
    news: NewsArticle[];
    supportWhatsapp?: string;
}

export default function NewsSlider({ news, supportWhatsapp }: NewsSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const totalSlides = news.length + 1; // +1 for ad slide

    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => {
            resetTimeout();
        };
    }, [currentIndex, totalSlides]);

    if (!news || news.length === 0) return null;

    return (
        <div className="relative w-full overflow-hidden rounded-xl shadow-md border border-surface-100">
            <div
                className="whitespace-nowrap transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${-currentIndex * 100}%)` }}
            >
                {news.map((item) => (
                    <div key={item.id} className="inline-block w-full align-top whitespace-normal">
                        <div className="relative bg-fire-700 min-h-[220px] p-6 flex flex-col justify-center text-white overflow-hidden group">
                            {/* Background Image (Optional, with overlay) */}
                            {item.image_url && (
                                <>
                                    <div
                                        className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-70 transition-opacity duration-700 group-hover:scale-105 transform"
                                        style={{ backgroundImage: `url(${item.image_url})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-fire-900/90 via-fire-800/60 to-transparent" />
                                </>
                            )}

                            {!item.image_url && (
                                <div className="absolute inset-0 carnival-gradient opacity-10" />
                            )}

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    {/* Fake "Urgent" tag logic for demo, or based on category */}
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

                                    <Link
                                        href={`/noticias/${item.id}`}
                                        className="flex items-center gap-1 text-xs font-bold text-white hover:text-amber-300 transition-colors"
                                    >
                                        Ler mais <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Ad Slide */}
                <div className="inline-block w-full align-top whitespace-normal">
                    <div className="relative min-h-[220px] p-6 flex flex-col items-center justify-center text-white overflow-hidden text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500" />
                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="font-display text-xl md:text-2xl font-bold mb-2 uppercase">Anuncie Aqui!</h3>
                            <p className="text-white/90 text-sm mb-4">Mostre sua marca para milhares de foliões</p>
                            <a
                                href={`https://wa.me/55${supportWhatsapp || '85994293148'}?text=Olá! Gostaria de anunciar no Guia Paracuru`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-7 py-2.5 bg-white text-orange-600 rounded-full font-bold text-[13px] hover:bg-white/90 transition-colors"
                            >
                                Saiba Mais
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1.5 z-20">
                {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                            }`}
                        onClick={() => setCurrentIndex(idx)}
                    />
                ))}
            </div>
        </div>
    );
}
