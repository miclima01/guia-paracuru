'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CATEGORY_LABELS } from '@/lib/utils';
import type { Business, BusinessCategory } from '@/types';

const InteractiveMap = dynamic(
  () => import('@/components/public/InteractiveMap'),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 bg-surface-100 rounded-xl animate-pulse flex items-center justify-center" style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-surface-400 text-sm mt-3">Carregando mapa...</p>
        </div>
      </div>
    ),
  }
);

export default function MapaPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadBusinesses();
  }, []);

  async function loadBusinesses() {
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('is_partner', { ascending: false })
      .order('order_index');

    if (data) setBusinesses(data);
    setLoading(false);
  }

  const filteredBusinesses =
    selectedCategory === 'all'
      ? businesses
      : businesses.filter((b) => b.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Category filter */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'carnival-gradient text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            <MapPin size={14} />
            Todos
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === key
                  ? 'carnival-gradient text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 px-4">
        {loading ? (
          <div className="flex-1 bg-surface-100 rounded-xl animate-pulse flex items-center justify-center" style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}>
            <div className="animate-spin w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full" />
          </div>
        ) : filteredBusinesses.filter((b) => b.latitude && b.longitude).length === 0 ? (
          <div className="text-center py-12">
            <Store size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400">Nenhum local com coordenadas encontrado</p>
          </div>
        ) : (
          <InteractiveMap businesses={filteredBusinesses} />
        )}
      </div>
    </div>
  );
}
