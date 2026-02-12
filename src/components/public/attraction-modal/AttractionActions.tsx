
'use client';

import { Attraction } from '@/types';
import { Share2, Link as LinkIcon, ExternalLink, MapPin } from 'lucide-react';
import { useState } from 'react';
import { formatDateWithWeekday, formatTime } from '@/lib/utils';
import { InstagramIcon } from '@/components/icons/InstagramIcon';

interface AttractionActionsProps {
    attraction: Attraction;
}

export function AttractionActions({ attraction }: AttractionActionsProps) {
    const [copied, setCopied] = useState(false);

    const shareWhatsApp = () => {
        const text = `🎉 *${attraction.artist || attraction.name}*\n📅 ${formatDateWithWeekday(attraction.date)}\n⏰ ${formatTime(attraction.start_time)}\n📍 ${attraction.location || 'Paracuru'}\n\nVem pro Carnaval de Paracuru 2026! 🎊`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const copyLink = async () => {
        const text = `${attraction.artist || attraction.name} - ${formatDateWithWeekday(attraction.date)} às ${formatTime(attraction.start_time)} em ${attraction.location || 'Paracuru'}`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const openMap = () => {
        if (attraction.latitude && attraction.longitude) {
            const url = `https://www.google.com/maps/search/?api=1&query=${attraction.latitude},${attraction.longitude}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="space-y-3 pt-4 border-t border-surface-100 bg-white p-6 rounded-b-2xl">
            <div className="flex gap-3">
                {/* Instagram Button */}
                {attraction.instagram && (
                    <a
                        href={`https://instagram.com/${attraction.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        <InstagramIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Instagram</span>
                        <ExternalLink size={14} className="opacity-70" />
                    </a>
                )}

                {/* Location Button */}
                {attraction.latitude && attraction.longitude && (
                    <button
                        onClick={openMap}
                        className="flex-1 px-4 py-3 rounded-xl bg-surface-100 text-surface-900 text-sm font-bold shadow-sm hover:bg-surface-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <MapPin size={18} />
                        <span>Como Chegar</span>
                    </button>
                )}
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={shareWhatsApp}
                    className="px-4 py-3 rounded-xl bg-surface-100 text-surface-900 text-sm font-bold hover:bg-surface-200 transition-colors active:scale-95 flex items-center justify-center gap-2"
                >
                    <Share2 size={18} />
                    <span>Compartilhar</span>
                </button>
                <button
                    onClick={copyLink}
                    className="px-4 py-3 rounded-xl bg-surface-100 text-surface-900 text-sm font-bold hover:bg-surface-200 transition-colors active:scale-95 flex items-center justify-center gap-2"
                >
                    <LinkIcon size={18} />
                    <span>{copied ? 'Copiado!' : 'Copiar Info'}</span>
                </button>
            </div>
        </div>
    );
}
