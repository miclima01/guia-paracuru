'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Store, List, Map as MapIcon, Phone, MessageCircle, Navigation, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CATEGORY_LABELS, SERVICE_CATEGORY_LABELS } from '@/lib/utils';
import type { Business, Service } from '@/types';
import type { MapMarker } from '@/components/public/InteractiveMap';
import type { BusinessCategory, ServiceCategory } from '@/types';

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
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
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

  function getMarkerLabel(marker: MapMarker): string {
    if (marker.source === 'service') {
      return SERVICE_CATEGORY_LABELS[marker.category as ServiceCategory] || marker.category;
    }
    return CATEGORY_LABELS[marker.category as BusinessCategory] || marker.category;
  }

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Category filter */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${selectedCategory === 'all'
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
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${selectedCategory === id
                  ? 'carnival-gradient text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 relative">
        {loading ? (
          <div className="flex-1 bg-surface-100 rounded-xl animate-pulse flex items-center justify-center" style={{ height: 'calc(100vh - 200px)', minHeight: '400px' }}>
            <div className="animate-spin w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full" />
          </div>
        ) : filteredMarkers.length === 0 ? (
          <div className="text-center py-12">
            <Store size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400">Nenhum local encontrado nesta categoria</p>
          </div>
        ) : viewMode === 'map' ? (
          <InteractiveMap markers={filteredMarkers} />
        ) : (
          <div className="space-y-3 pb-20">
            {filteredMarkers.map((item) => (
              <div key={`${item.source}-${item.id}`} className="bg-white rounded-xl p-4 shadow-sm border border-surface-100 flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 shrink-0 bg-surface-100 rounded-lg overflow-hidden relative">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                      <Store size={24} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1 mb-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${item.source === 'service' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {getMarkerLabel(item)}
                    </span>
                    {item.is_partner && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                        Parceiro
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-surface-900 leading-tight mb-1">{item.name}</h3>

                  {item.is_partner && (
                    <div className="flex gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-xs text-surface-500 line-clamp-1 mb-2">{item.description}</p>
                  )}

                  <div className="flex gap-2 mt-auto">
                    {(item.whatsapp || item.phone) && (
                      <a
                        href={`https://wa.me/55${(item.whatsapp || item.phone || '').replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm"
                      >
                        <MessageCircle size={16} />
                      </a>
                    )}
                    {(item.latitude && item.longitude) && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm"
                      >
                        <Navigation size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toggle Button (Floating) */}
        {!loading && markers.length > 0 && (
          <button
            onClick={() => setViewMode(prev => prev === 'map' ? 'list' : 'map')}
            className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-surface-900 text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            {viewMode === 'map' ? (
              <>
                <List size={18} />
                Ver Lista
              </>
            ) : (
              <>
                <MapIcon size={18} />
                Ver Mapa
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
