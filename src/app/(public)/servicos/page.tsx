'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, MapPin, Phone, Search, Store, Star } from 'lucide-react';
import type { Business, BusinessCategory } from '@/types';
import { CATEGORY_LABELS } from '@/lib/utils';

export default function ServicesPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories: { id: string; label: string }[] = [
        { id: 'all', label: 'Todos' },
        { id: 'market', label: 'Mercados' },
        { id: 'pharmacy', label: 'Farmácias' },
        { id: 'gas_station', label: 'Postos' },
        { id: 'hotel', label: 'Hospedagem' }, // Maybe move to separate page later? Keeping here for now as "Services/Stay"
        { id: 'other', label: 'Outros' },
    ];

    // Logic to filter NON-gastronomy businesses
    // Gastronomy = restaurant, bar, beach_club
    const excludedCategories = ['restaurant', 'bar', 'beach_club'];

    useEffect(() => {
        async function loadBusinesses() {
            try {
                // Fetch ALL and filter on client or complex query
                // Supabase 'not.in' filter
                let query = supabase
                    .from('businesses')
                    .select('*')
                    .not('category', 'in', `(${excludedCategories.map(c => `"${c}"`).join(',')})`)
                    .order('name');

                const { data } = await query;
                if (data) setBusinesses(data);
            } catch (error) {
                console.error('Erro ao carregar serviços:', error);
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
            <header className="bg-emerald-600 text-white pt-8 pb-12 px-4 rounded-b-[2rem] shadow-lg">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
                        <ShoppingBag size={24} />
                    </div>
                    <h1 className="font-display text-3xl mb-2">Serviços e Úteis</h1>
                    <p className="text-white/80">Mercados, farmácias e hospedagem</p>
                </div>
            </header>

            {/* Filters */}
            <div className="px-4 -mt-6 max-w-2xl mx-auto relative z-10">
                <div className="bg-white rounded-xl shadow-md p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar serviço..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-surface-50 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-200 transaction-all"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                    ? 'bg-emerald-500 text-white'
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
            <div className="px-4 mt-6 max-w-2xl mx-auto space-y-4">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : filteredBusinesses.length > 0 ? (
                    filteredBusinesses.map((biz) => (
                        <div key={biz.id} className="bg-white rounded-xl shadow-sm border border-surface-100 p-4 flex gap-4">
                            <div className="w-16 h-16 bg-surface-100 rounded-lg shrink-0 overflow-hidden">
                                {biz.image_url ? (
                                    <img src={biz.image_url} alt={biz.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                                        <Store size={20} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-surface-900 truncate pr-2">{biz.name}</h3>
                                        {biz.rating && biz.rating > 0 && (
                                            <div className="flex items-center gap-0.5 mb-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={10}
                                                        className={`${i < Math.round(biz.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-surface-200'}`}
                                                    />
                                                ))}
                                                <span className="text-[10px] text-surface-500 font-medium ml-1">({biz.rating})</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 text-[10px] text-surface-500 mb-1">
                                            <span className="px-1.5 py-0.5 rounded bg-surface-100 text-surface-600 font-medium">
                                                {CATEGORY_LABELS[biz.category as BusinessCategory]}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-surface-500 line-clamp-1 mb-2">{biz.description}</p>

                                <div className="flex gap-2">
                                    {biz.phone && (
                                        <a href={`tel:${biz.phone}`} className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100">
                                            <Phone size={12} /> Ligar
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
        </div>
    );
}
