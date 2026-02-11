'use client';

import { Attraction } from '@/types';
import { X, Calendar, Clock, MapPin, Music, Sparkles, Share2, Download, Link as LinkIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AttractionModalProps {
    attraction: Attraction | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function AttractionModal({ attraction, isOpen, onClose }: AttractionModalProps) {
    const [copied, setCopied] = useState(false);

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !attraction) return null;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (timeStr?: string) => {
        if (!timeStr) return null;
        return timeStr.substring(0, 5);
    };

    // Generate calendar file (.ics)
    const downloadCalendar = () => {
        const startDateTime = `${attraction.date.replace(/-/g, '')}T${attraction.start_time.replace(/:/g, '')}00`;
        const endDateTime = attraction.end_time
            ? `${attraction.date.replace(/-/g, '')}T${attraction.end_time.replace(/:/g, '')}00`
            : `${attraction.date.replace(/-/g, '')}T235900`;

        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Guia Paracuru//Carnaval 2026//PT',
            'BEGIN:VEVENT',
            `DTSTART:${startDateTime}`,
            `DTEND:${endDateTime}`,
            `SUMMARY:${attraction.artist || attraction.name}`,
            `DESCRIPTION:${attraction.description || attraction.name}`,
            `LOCATION:${attraction.location || 'Paracuru, CE'}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${(attraction.artist || attraction.name).replace(/\s+/g, '_')}.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Share functions
    const shareWhatsApp = () => {
        const text = `🎉 *${attraction.artist || attraction.name}*\n📅 ${formatDate(attraction.date)}\n⏰ ${formatTime(attraction.start_time)}\n📍 ${attraction.location || 'Paracuru'}\n\nVem pro Carnaval de Paracuru 2026! 🎊`;
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const shareTwitter = () => {
        const text = `🎉 ${attraction.artist || attraction.name} no Carnaval de Paracuru 2026!\n📅 ${formatDate(attraction.date)}\n⏰ ${formatTime(attraction.start_time)}\n📍 ${attraction.location || 'Paracuru'} #CarnavalParacuru2026`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const copyLink = async () => {
        const text = `${attraction.artist || attraction.name} - ${formatDate(attraction.date)} às ${formatTime(attraction.start_time)} em ${attraction.location || 'Paracuru'}`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
                >
                    <X size={20} className="text-surface-900" />
                </button>

                {/* Header Image */}
                <div className="relative h-56 bg-gradient-to-br from-carnival-500 to-carnival-700 rounded-t-2xl overflow-hidden">
                    {attraction.image_url ? (
                        <>
                            <img
                                src={attraction.image_url}
                                alt={attraction.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center carnival-gradient-dark">
                            <Music size={64} className="text-white/30" />
                        </div>
                    )}

                    {/* Premium Badge */}
                    {attraction.is_premium && (
                        <div className="absolute top-4 left-4">
                            <span className="category-pill bg-white/90 text-carnival-700 shadow-lg px-3 py-1.5 flex items-center gap-1.5">
                                <Sparkles size={12} />
                                Premium
                            </span>
                        </div>
                    )}

                    {/* Date Badge */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                            <div className="flex items-center gap-2 text-carnival-700">
                                <Calendar size={18} />
                                <span className="font-bold text-sm">
                                    {formatDate(attraction.date)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Artist/Name */}
                    {attraction.artist && (
                        <div className="mb-2">
                            <span className="category-pill bg-carnival-100 text-carnival-700 text-xs">
                                Artista
                            </span>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-surface-900 mb-1">
                        {attraction.artist || attraction.name}
                    </h2>

                    {attraction.artist && attraction.name !== attraction.artist && (
                        <p className="text-surface-500 text-sm mb-4">{attraction.name}</p>
                    )}

                    {/* Description */}
                    {attraction.description && (
                        <p className="text-surface-600 mb-6 leading-relaxed">
                            {attraction.description}
                        </p>
                    )}

                    {/* Event Details */}
                    <div className="space-y-4 mb-6">
                        {/* Time */}
                        <div className="flex items-start gap-3">
                            <Clock size={20} className="text-carnival-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-surface-900 text-sm mb-1">Horário</p>
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
                                    <p className="font-semibold text-surface-900 text-sm mb-1">Local</p>
                                    <p className="text-surface-600 text-sm">{attraction.location}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4 border-t border-surface-100">
                        {/* Primary Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={downloadCalendar}
                                className="btn-primary carnival-gradient text-white flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                Adicionar ao Calendário
                            </button>
                            <button
                                onClick={shareWhatsApp}
                                className="btn-secondary flex items-center justify-center gap-2"
                            >
                                <Share2 size={18} />
                                Compartilhar
                            </button>
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={shareTwitter}
                                className="flex-1 px-4 py-2 rounded-lg bg-surface-100 text-surface-700 text-sm font-semibold hover:bg-surface-200 transition-colors active:scale-95 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                Twitter
                            </button>
                            <button
                                onClick={copyLink}
                                className="flex-1 px-4 py-2 rounded-lg bg-surface-100 text-surface-700 text-sm font-semibold hover:bg-surface-200 transition-colors active:scale-95 flex items-center justify-center gap-2"
                            >
                                <LinkIcon size={16} />
                                {copied ? 'Copiado!' : 'Copiar Info'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
