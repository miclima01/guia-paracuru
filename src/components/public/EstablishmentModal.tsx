'use client';

import { Business, BusinessCategory } from '@/types';
import { CATEGORY_LABELS, formatPhone } from '@/lib/utils';
import Image from 'next/image';
import { X, MapPin, Phone, Instagram, Globe, Navigation, Star, Clock } from 'lucide-react';
import { useEffect } from 'react';

interface EstablishmentModalProps {
    business: Business | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function EstablishmentModal({ business, isOpen, onClose }: EstablishmentModalProps) {
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

    if (!isOpen || !business) return null;

    const whatsappNumber = business.whatsapp || business.phone;
    const whatsappLink = whatsappNumber ? `https://wa.me/55${whatsappNumber.replace(/\D/g, '')}` : null;

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
                <div className="relative h-48 bg-surface-200 rounded-t-2xl overflow-hidden">
                    {business.image_url ? (
                        <Image
                            src={business.image_url}
                            alt={business.name}
                            className="w-full h-full object-cover"
                            fill
                            sizes="(max-width: 672px) 100vw, 672px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200">
                            <MapPin size={48} className="text-surface-300" />
                        </div>
                    )}

                    {/* Partner Badge */}
                    {business.is_partner && (
                        <div className="absolute top-4 left-4">
                            <span className="category-pill bg-carnival-500 text-white shadow-lg px-3 py-1.5">
                                Parceiro
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Category */}
                    <span className="category-pill bg-fire-100 text-fire-700 mb-3">
                        {CATEGORY_LABELS[business.category as BusinessCategory]}
                    </span>

                    {/* Name */}
                    <h2 className="text-2xl font-bold text-surface-900 mb-1">{business.name}</h2>
                    {business.rating && business.rating > 0 && (
                        <div className="flex items-center gap-0.5 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    className={`${i < Math.round(business.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-surface-200'}`}
                                />
                            ))}
                            <span className="text-sm text-surface-600 font-medium ml-1">({business.rating})</span>
                        </div>
                    )}

                    {/* Description */}
                    {business.description && (
                        <p className="text-surface-600 mb-6 leading-relaxed">{business.description}</p>
                    )}

                    {/* Contact Information */}
                    <div className="space-y-4 mb-6">
                        {/* Address */}
                        {business.address && (
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-fire-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-surface-900 text-sm mb-1">Endereço</p>
                                    <p className="text-surface-600 text-sm">{business.address}</p>
                                </div>
                            </div>
                        )}

                        {/* Opening Hours */}
                        {business.opening_hours && (
                            <div className="flex items-start gap-3">
                                <Clock size={20} className="text-fire-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-surface-900 text-sm mb-1">Horário de Funcionamento</p>
                                    <p className="text-surface-600 text-sm">{business.opening_hours}</p>
                                </div>
                            </div>
                        )}

                        {/* Phone */}
                        {business.phone && (
                            <div className="flex items-start gap-3">
                                <Phone size={20} className="text-fire-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-surface-900 text-sm mb-1">Telefone</p>
                                    <a
                                        href={`tel:${business.phone}`}
                                        className="text-fire-600 hover:underline text-sm"
                                    >
                                        {formatPhone(business.phone)}
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Instagram */}
                        {business.instagram && (
                            <div className="flex items-start gap-3">
                                <Instagram size={20} className="text-fire-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-surface-900 text-sm mb-1">Instagram</p>
                                    <a
                                        href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-fire-600 hover:underline text-sm"
                                    >
                                        @{business.instagram.replace('@', '')}
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Website */}
                        {business.website && (
                            <div className="flex items-start gap-3">
                                <Globe size={20} className="text-fire-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-surface-900 text-sm mb-1">Website</p>
                                    <a
                                        href={business.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-fire-600 hover:underline text-sm break-all"
                                    >
                                        {business.website}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                        {/* WhatsApp Button */}
                        {whatsappLink && (
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                WhatsApp
                            </a>
                        )}

                        {/* Call Button */}
                        {business.phone && (
                            <a
                                href={`tel:${business.phone}`}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-100 text-surface-900 font-semibold text-sm hover:bg-surface-200 active:scale-95 transition-all"
                            >
                                <Phone size={18} />
                                Ligar
                            </a>
                        )}
                    </div>

                    {/* Route Button */}
                    {business.latitude && business.longitude && (
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-sm active:scale-95 transition-all"
                        >
                            <Navigation size={18} />
                            Abrir rota no Maps
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
