
import { Attraction } from '@/types';
import { Sparkles, Calendar, Music, X } from 'lucide-react';
import { formatDateWithWeekday } from '@/lib/utils';
import Image from 'next/image';

interface AttractionHeaderProps {
    attraction: Attraction;
    onClose: () => void;
}

export function AttractionHeader({ attraction, onClose }: AttractionHeaderProps) {
    return (
        <div className="relative h-56 bg-gradient-to-br from-carnival-500 to-carnival-700 rounded-t-2xl overflow-hidden shrink-0">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all active:scale-95 text-surface-900"
                aria-label="Fechar"
            >
                <X size={20} />
            </button>

            {attraction.image_url ? (
                <>
                    {/* Using standard img tag for external URLs if domain not configured in next.config.js, 
                but preferably use Next.js Image if possible. for now sticking to img as per original code 
                to avoid configuration issues, but making it responsive-friendly */}
                    <img
                        src={attraction.image_url}
                        alt={attraction.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                </>
            ) : (
                <div className="w-full h-full flex items-center justify-center carnival-gradient-dark">
                    <Music size={64} className="text-white/30" />
                </div>
            )}

            {/* Premium Badge */}
            {attraction.is_premium && (
                <div className="absolute top-4 left-4 z-10">
                    <span className="category-pill bg-white/90 text-carnival-700 shadow-lg px-3 py-1.5 flex items-center gap-1.5 font-medium text-xs">
                        <Sparkles size={12} />
                        Premium
                    </span>
                </div>
            )}

            {/* Date Badge */}
            <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg inline-flex">
                    <div className="flex items-center gap-2 text-carnival-700">
                        <Calendar size={18} />
                        <span className="font-bold text-sm capitalize">
                            {formatDateWithWeekday(attraction.date)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
