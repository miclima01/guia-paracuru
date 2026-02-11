'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Business, BusinessCategory } from '@/types';
import { CATEGORY_LABELS, formatPhone } from '@/lib/utils';
import { ArrowLeft, MapPin, Phone, Globe, Star } from 'lucide-react';
import Link from 'next/link';

export default function EstablishmentPage() {
    const params = useParams();
    const router = useRouter();
    const [business, setBusiness] = useState<Business | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBusiness() {
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('id', params.id)
                .single();

            if (error) {
                console.error('Error fetching business:', error);
                setLoading(false);
                return;
            }

            setBusiness(data);
            setLoading(false);
        }

        if (params.id) {
            fetchBusiness();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-fire-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-surface-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-surface-900 mb-2">Estabelecimento não encontrado</h1>
                    <Link href="/" className="text-fire-600 hover:underline">
                        Voltar para a página inicial
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50">
            {/* Header Image */}
            <div className="relative h-64 bg-surface-200">
                {business.image_url ? (
                    <img
                        src={business.image_url}
                        alt={business.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-100 to-surface-200">
                        <MapPin size={64} className="text-surface-300" />
                    </div>
                )}

                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all active:scale-95"
                >
                    <ArrowLeft size={20} className="text-surface-900" />
                </button>

                {/* Partner Badge */}
                {business.is_partner && (
                    <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 bg-carnival-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                            <Star size={16} fill="currentColor" />
                            Parceiro
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6 -mt-8">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    {/* Category */}
                    <span className="category-pill bg-fire-100 text-fire-700 mb-3">
                        {CATEGORY_LABELS[business.category as BusinessCategory]}
                    </span>

                    {/* Name */}
                    <h1 className="text-3xl font-bold text-surface-900 mb-2">{business.name}</h1>

                    {/* Description */}
                    {business.description && (
                        <p className="text-surface-600 text-lg mb-6 leading-relaxed">{business.description}</p>
                    )}

                    {/* Contact Information */}
                    <div className="space-y-4">
                        {/* Address */}
                        {business.address && (
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-fire-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-surface-900 mb-1">Endereço</p>
                                    <p className="text-surface-600">{business.address}</p>
                                </div>
                            </div>
                        )}

                        {/* Phone */}
                        {business.phone && (
                            <div className="flex items-start gap-3">
                                <Phone size={20} className="text-fire-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-surface-900 mb-1">Telefone</p>
                                    <a
                                        href={`tel:${business.phone}`}
                                        className="text-fire-600 hover:underline"
                                    >
                                        {formatPhone(business.phone)}
                                    </a>
                                </div>
                            </div>
                        )}


                        {/* Website */}
                        {business.website && (
                            <div className="flex items-start gap-3">
                                <Globe size={20} className="text-fire-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-surface-900 mb-1">Website</p>
                                    <a
                                        href={business.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-fire-600 hover:underline break-all"
                                    >
                                        {business.website}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Card (if coordinates exist) */}
                {business.latitude && business.longitude && (
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-surface-900 mb-4">Localização</h2>
                        <div className="aspect-video bg-surface-100 rounded-xl overflow-hidden">
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                src={`https://www.google.com/maps?q=${business.latitude},${business.longitude}&output=embed`}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
