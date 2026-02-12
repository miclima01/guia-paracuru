
import { Attraction } from '@/types';
import { Clock, MapPin } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface AttractionInfoProps {
    attraction: Attraction;
}

export function AttractionInfo({ attraction }: AttractionInfoProps) {
    return (
        <div className="p-6">
            {/* Artist/Name Tag */}
            {attraction.artist && (
                <div className="mb-2">
                    <span className="category-pill bg-carnival-100 text-carnival-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Artista
                    </span>
                </div>
            )}

            <h2 className="text-2xl font-bold text-surface-900 mb-1 leading-tight">
                {attraction.artist || attraction.name}
            </h2>

            {attraction.artist && attraction.name !== attraction.artist && (
                <p className="text-surface-500 text-sm mb-4">{attraction.name}</p>
            )}

            {/* Description */}
            {attraction.description && (
                <p className="text-surface-600 mb-6 leading-relaxed text-sm sm:text-base">
                    {attraction.description}
                </p>
            )}

            {/* Event Details */}
            <div className="space-y-4 mb-6">
                {/* Time */}
                <div className="flex items-start gap-3">
                    <Clock size={20} className="text-carnival-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-surface-900 text-sm mb-0.5">Horário</p>
                        <p className="text-surface-600 text-sm">
                            {formatTime(attraction.start_time)}
                            {attraction.end_time && ` - ${formatTime(attraction.end_time)}`}
                        </p>
                    </div>
                </div>

                {/* Location */}
                {attraction.location && (
                    <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-carnival-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-surface-900 text-sm mb-0.5">Local</p>
                            <p className="text-surface-600 text-sm">{attraction.location}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
