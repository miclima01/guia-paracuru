'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Beer, MapPin, Search, Store, Star, Clock } from 'lucide-react';
import type { Business, BusinessCategory } from '@/types';
import { CATEGORY_LABELS } from '@/lib/utils';
import EstablishmentModal from '@/components/public/EstablishmentModal';

function getCategoryLabel(category: string): string {
    return CATEGORY_LABELS[category as BusinessCategory] || category;
}

export default function GastronomiaPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState<{ id: string; label: string }[]>([
        { id: 'all', label: 'Todos' },
    ]);

    useEffect(() => {
        async function loadBusinesses() {
            try {
                const { data } = await supabase
                    .from('businesses')
                    .select('*')
                    .order('is_featured', { ascending: false })
                    .order('name');

                if (data) {
                    setBusinesses(data as Business[]);
                    // Always show predefined categories + any custom ones from data
                    const customCats = [...new Set(data.map((b: Business) => b.category))]
                        .filter(cat => !(cat in CATEGORY_LABELS));
                    setCategories([
                        { id: 'all', label: 'Todos' },
                        ...Object.entries(CATEGORY_LABELS).map(([id, label]) => ({ id, label })),
                        ...customCats.map(cat => ({ id: cat, label: cat })),
                    ]);
                }
            } catch (error) {
                console.error('Erro ao carregar locais:', error);
            } finally {
                setLoading(false);
            }
        }
        loadBusinesses();
    }, []);

    const filteredBusinesses = businesses.filter((biz) => {
        const matchesSearch = biz.name.toLowerCase().includes(search.toLowerCase()) ||
            biz.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || biz.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            {/* Header */}
            <section className="px-0 sm:px-4 sm:pt-4 pb-2 max-w-2xl mx-auto">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white sm:rounded-xl shadow-xl">
                    <div className="px-5 pt-8 pb-6 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
                            <Beer size={24} className="text-white" />
                        </div>
                        <h1 className="font-display text-3xl mb-2 text-white">Gastronomia</h1>
                        <p className="text-white/80">Onde comer e beber no Carnaval</p>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <div className="px-4 mt-6 max-w-2xl mx-auto">
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar restaurante, bar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-carnival-200 border border-surface-200"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat.id
                                    ? 'carnival-gradient text-white'
                                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="px-4 mt-6 pb-6 max-w-2xl mx-auto">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-carnival-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : filteredBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredBusinesses.map((biz) => (
                            <button
                                key={biz.id}
                                onClick={() => {
                                    setSelectedBusiness(biz);
                                    setIsModalOpen(true);
                                }}
                                className="bg-white rounded-xl shadow-sm border border-surface-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer text-left w-full"
                            >
                                <div className="h-32 bg-surface-100 relative">
                                    {biz.image_url ? (
                                        <Image src={biz.image_url} alt={biz.name} className="object-cover" fill sizes="(max-width: 640px) 100vw, 50vw" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-surface-300">
                                            <Store size={32} />
                                        </div>
                                    )}
                                    {biz.is_featured && (
                                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-bold shadow-sm">
                                            DESTAQUE
                                        </span>
                                    )}
                                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium border border-white/20">
                                        {getCategoryLabel(biz.category)}
                                    </span>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-surface-900">{biz.name}</h3>
                                    {biz.rating && biz.rating > 0 && (
                                        <div className="flex items-center gap-0.5 mb-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={`${i < Math.round(biz.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-surface-200'}`}
                                                />
                                            ))}
                                            <span className="text-xs text-surface-500 font-medium ml-1">({biz.rating})</span>
                                        </div>
                                    )}
                                    <p className="text-sm text-surface-500 mt-1 line-clamp-2">{biz.description}</p>

                                    <div className="mt-4 space-y-2">
                                        {biz.address && (
                                            <div className="flex items-start gap-2 text-xs text-surface-500">
                                                <MapPin size={14} className="shrink-0 mt-0.5" />
                                                <span>{biz.address}</span>
                                            </div>
                                        )}
                                        {biz.opening_hours && (
                                            <div className="flex items-start gap-2 text-xs text-surface-500">
                                                <Clock size={14} className="shrink-0 mt-0.5" />
                                                <span>{biz.opening_hours}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-surface-400">
                        <p>Nenhum local encontrado.</p>
                    </div>
                )}
            </div>

            {/* Establishment Modal */}
            <EstablishmentModal
                business={selectedBusiness}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedBusiness(null);
                }}
            />
        </div>
    );
}
