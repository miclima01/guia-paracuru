'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CATEGORY_LABELS, SERVICE_CATEGORY_LABELS } from '@/lib/utils';
import type { Business, Service } from '@/types';
import type { MapMarker } from '@/components/public/InteractiveMap';

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
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [bizRes, svcRes] = await Promise.all([
      supabase
        .from('businesses')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('is_partner', { ascending: false })
        .order('order_index'),
      supabase
        .from('services')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('name'),
    ]);

    const bizMarkers: MapMarker[] = (bizRes.data || []).map((b: Business) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      category: b.category,
      address: b.address,
      phone: b.phone,
      whatsapp: b.whatsapp,
      instagram: b.instagram,
      image_url: b.image_url,
      latitude: b.latitude,
      longitude: b.longitude,
      is_partner: b.is_partner,
      is_featured: b.is_featured,
      source: 'business' as const,
    }));

    const svcMarkers: MapMarker[] = (svcRes.data || []).map((s: Service) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      category: s.category,
      address: s.address,
      whatsapp: s.whatsapp,
      instagram: s.instagram,
      image_url: s.image_url,
      latitude: s.latitude,
      longitude: s.longitude,
      is_featured: s.is_featured,
      source: 'service' as const,
    }));

    const allMarkers = [...bizMarkers, ...svcMarkers];
    setMarkers(allMarkers);

    // Build unique categories from both sources
    const allCatLabels: Record<string, string> = { ...CATEGORY_LABELS };

    // Add service-only categories that don't overlap
    for (const [key, label] of Object.entries(SERVICE_CATEGORY_LABELS)) {
      if (!(key in allCatLabels)) {
        allCatLabels[key] = label;
      }
    }

    // Add custom categories from data
    for (const m of allMarkers) {
      if (!(m.category in allCatLabels) && m.category) {
        allCatLabels[m.category] = m.category;
      }
    }

    setCategories(
      Object.entries(allCatLabels).map(([id, label]) => ({ id, label }))
    );

    setLoading(false);
  }

  const filteredMarkers =
    selectedCategory === 'all'
      ? markers
      : markers.filter((m) => m.category === selectedCategory);

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
          {categories.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === id
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
        ) : filteredMarkers.filter((m) => m.latitude && m.longitude).length === 0 ? (
          <div className="text-center py-12">
            <Store size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400">Nenhum local com coordenadas encontrado</p>
          </div>
        ) : (
          <InteractiveMap markers={filteredMarkers} />
        )}
      </div>
    </div>
  );
}
