'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, MapPin, Search, Store, Star, MessageCircle, Instagram, Phone } from 'lucide-react';
import type { Service, ServiceCategory } from '@/types';
import { SERVICE_CATEGORY_LABELS } from '@/lib/utils';
import PremiumGate from '@/components/public/PremiumGate';

function getCategoryLabel(category: string): string {
    return SERVICE_CATEGORY_LABELS[category as ServiceCategory] || category;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<{ id: string; label: string }[]>([
        { id: 'all', label: 'Todos' },
    ]);

    useEffect(() => {
        async function loadServices() {
            try {
                const { data } = await supabase
                    .from('services')
                    .select('*')
                    .order('is_featured', { ascending: false })
                    .order('name');

                if (data) {
                    setServices(data as Service[]);
                    // Always show predefined categories + any custom ones from data
                    const customCats = [...new Set(data.map((s: Service) => s.category))]
                        .filter(cat => !(cat in SERVICE_CATEGORY_LABELS));
                    setCategories([
                        { id: 'all', label: 'Todos' },
                        ...Object.entries(SERVICE_CATEGORY_LABELS).map(([id, label]) => ({ id, label })),
                        ...customCats.map(cat => ({ id: cat, label: cat })),
                    ]);
                }
            } catch (error) {
                console.error('Erro ao carregar serviços:', error);
            } finally {
                setLoading(false);
            }
        }
        loadServices();
    }, []);

    const filteredServices = services.filter((svc) => {
        const matchesSearch = svc.name.toLowerCase().includes(search.toLowerCase()) ||
            svc.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || svc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            {/* Header */}
            <section className="px-0 sm:px-4 sm:pt-4 pb-2 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 noise sm:rounded-xl shadow-xl">
                    <div className="px-5 pt-8 pb-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
                            <ShoppingBag size={24} className="text-white" />
                        </div>
                        <h1 className="font-display text-3xl mb-2 text-white">Serviços</h1>
                        <p className="text-white/80">Pousadas, hospitais, farmácias e mais</p>
                    </div>
                </div>
            </section>

            {/* Search and Filters */}
            <PremiumGate>
                <div className="px-4 mt-6 max-w-2xl mx-auto space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar serviço..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-surface-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md'
                                    : 'bg-white border border-surface-200 text-surface-600 hover:bg-surface-50'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="px-4 mt-6 max-w-2xl mx-auto space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredServices.length > 0 ? (
                        filteredServices.map((svc) => (
                            <div key={svc.id} className="bg-white rounded-xl shadow-sm border border-surface-100 p-4 flex gap-4">
                                <div className="w-16 h-16 bg-surface-100 rounded-lg shrink-0 overflow-hidden">
                                    {svc.image_url ? (
                                        <img src={svc.image_url} alt={svc.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-surface-300">
                                            <Store size={20} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-surface-900 truncate pr-2">{svc.name}</h3>
                                                {svc.is_featured && (
                                                    <Star size={14} className="text-amber-400 fill-amber-400 shrink-0" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] text-surface-500 mb-1">
                                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">
                                                    {getCategoryLabel(svc.category)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {svc.description && (
                                        <p className="text-xs text-surface-500 line-clamp-1 mb-1">{svc.description}</p>
                                    )}

                                    {svc.address && (
                                        <div className="flex items-center gap-1 text-xs text-surface-400 mb-2">
                                            <MapPin size={12} />
                                            <span className="truncate">{svc.address}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        {svc.phone && (
                                            <a
                                                href={`tel:${svc.phone.replace(/\D/g, '')}`}
                                                className="flex items-center gap-1 text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded hover:bg-violet-100 transition-colors"
                                            >
                                                <Phone size={12} /> Ligar
                                            </a>
                                        )}
                                        {svc.whatsapp && (
                                            <a
                                                href={`https://wa.me/55${svc.whatsapp.replace(/\D/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100 transition-colors"
                                            >
                                                <MessageCircle size={12} /> WhatsApp
                                            </a>
                                        )}
                                        {svc.instagram && (
                                            <a
                                                href={`https://instagram.com/${svc.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded hover:bg-pink-100 transition-colors"
                                            >
                                                <Instagram size={12} /> Instagram
                                            </a>
                                        )}
                                        {svc.latitude && svc.longitude && (
                                            <a
                                                href={`https://www.google.com/maps?q=${svc.latitude},${svc.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                            >
                                                <MapPin size={12} /> Mapa
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-surface-400">
                            <p>Nenhum serviço encontrado.</p>
                        </div>
                    )}
                </div>
            </PremiumGate>
        </div>
    );
}
