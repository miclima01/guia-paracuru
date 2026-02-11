'use client';

import Image from 'next/image';
import { MapPin, Music, Star, Lock } from 'lucide-react';
import { Attraction } from '@/types';
import { formatTime, cn } from '@/lib/utils';

interface AttractionCardProps {
    attraction: Attraction;
    isPremium: boolean;
    onUnlock?: () => void;
}

export default function AttractionCard({ attraction, isPremium, onUnlock }: AttractionCardProps) {
    const isLocked = attraction.is_premium && !isPremium;

    return (
        <div className={cn(
            "rounded-lg shadow-sm border overflow-hidden flex flex-col md:flex-row transition-all",
            attraction.is_featured
                ? "bg-gradient-to-r from-purple-800 to-pink-600 border-none shadow-md transform hover:scale-[1.01]"
                : "bg-white border-surface-100"
        )}>
            {/* Image / Cover */}
            <div className="relative h-44 md:min-h-[11rem] md:w-44 md:min-w-[176px] bg-surface-100 flex-shrink-0">
                {attraction.image_url ? (
                    <Image
                        src={attraction.image_url}
                        alt={attraction.name}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 176px"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                        <Music size={40} />
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {attraction.is_featured && (
                        <div className="bg-yellow-400 text-purple-900 text-[10px] font-bold px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm uppercase tracking-wider">
                            <Star size={10} fill="currentColor" />
                            DESTAQUE
                        </div>
                    )}
                    {attraction.is_premium && (
                        <div className="bg-fire-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <Star size={10} fill="currentColor" />
                            PREMIUM content
                        </div>
                    )}
                </div>

                {/* Music Icon Overlay (Decorative) */}
                <div className="absolute top-3 right-3 text-white/80 drop-shadow-md">
                    <Music size={20} />
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-center relative">
                <div className={cn(
                    "absolute top-4 right-4",
                    attraction.is_featured ? "text-white/60" : "text-surface-400"
                )}>
                    <Music size={32} />
                </div>
                <div className="flex justify-between items-start">
                    <div>
                        {/* Locked State Badge */}
                        {isLocked && (
                            <div className="inline-flex items-center gap-1 bg-surface-100 text-surface-500 px-2 py-0.5 rounded textxs font-medium mb-2">
                                <Lock size={12} />
                                Premium
                            </div>
                        )}
                        <h3 className={cn(
                            "font-display text-lg leading-tight",
                            attraction.is_featured ? "text-white" : "text-surface-900"
                        )}>
                            {attraction.name}
                        </h3>
                        {attraction.artist && attraction.artist !== attraction.name && (
                            <p className={cn(
                                "font-medium mt-1",
                                attraction.is_featured ? "text-white/90" : "text-surface-600"
                            )}>
                                {attraction.artist}
                            </p>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="mt-3 flex flex-col gap-1">
                    {attraction.location && (
                        <div className={cn(
                            "flex items-center gap-1.5 text-xs",
                            attraction.is_featured ? "text-white/80" : "text-surface-500"
                        )}>
                            <MapPin size={14} />
                            {attraction.location_url ? (
                                <a
                                    href={attraction.location_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "hover:underline transition-colors font-medium underline decoration-current/50 hover:decoration-current",
                                        attraction.is_featured
                                            ? "text-amber-300 hover:text-amber-200"
                                            : "text-carnival-600 hover:text-carnival-700"
                                    )}
                                >
                                    {attraction.location}
                                </a>
                            ) : (
                                <span>{attraction.location}</span>
                            )}
                        </div>
                    )}
                    <div className={cn(
                        "flex items-center gap-1.5 text-xs",
                        attraction.is_featured ? "text-white/80" : "text-surface-500"
                    )}>
                        <div className={cn(
                            "w-1 h-1 rounded-full",
                            attraction.is_featured ? "bg-white/80" : "bg-surface-300"
                        )} />
                        {formatTime(attraction.start_time)}
                    </div>
                </div>

                {/* Unlock Button (Mobile friendly) */}
                {isLocked && onUnlock && (
                    <button
                        onClick={onUnlock}
                        className="mt-4 w-full py-2 bg-surface-900 text-white text-xs font-bold rounded-lg active:scale-95 transition-transform md:hidden"
                    >
                        Desbloquear Detalhes
                    </button>
                )}
            </div>
        </div>
    );
}
