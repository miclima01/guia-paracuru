'use client';

import { useEffect, useState } from 'react';
import {
  MapPin,
  Phone,
  Globe,
  Instagram,
  MessageCircle,
  Store,
  Star,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/hooks/useStore';
import { CATEGORY_LABELS, formatPhone } from '@/lib/utils';
import type { Business, BusinessCategory } from '@/types';

export default function MapaPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { isPremium, openPaymentModal } = useAppStore();

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

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)] as const;
  const filteredBusinesses =
    selectedCategory === 'all'
      ? businesses
      : businesses.filter((b) => b.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="carnival-gradient-dark noise px-5 pt-8 pb-6">
        <h1 className="font-display text-2xl text-white">Mapa</h1>
        <p className="text-white/70 text-sm mt-1">
          Estabelecimentos e pontos de interesse
        </p>
      </div>

      {/* Category filter */}
      <div className="px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'carnival-gradient text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
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

      {/* Businesses list */}
      <div className="px-4 mt-6 pb-6 max-w-lg mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Store size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400">Nenhum estabelecimento encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBusinesses.map((business) => {
              const isPremiumContent = business.is_premium && !isPremium;

              return (
                <div
                  key={business.id}
                  className="bg-white rounded-2xl shadow-sm border border-surface-100 overflow-hidden"
                >
                  {business.image_url && (
                    <div className="h-40 bg-surface-100 overflow-hidden relative">
                      <img
                        src={business.image_url}
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                      {business.is_featured && (
                        <div className="absolute top-3 right-3 bg-sand-400 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <Star size={12} fill="currentColor" />
                          Destaque
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="category-pill bg-ocean-100 text-ocean-700">
                        {CATEGORY_LABELS[business.category as BusinessCategory]}
                      </span>
                      {business.is_partner && (
                        <span className="category-pill bg-carnival-100 text-carnival-700">
                          Parceiro
                        </span>
                      )}
                      {business.is_premium && (
                        <span className="category-pill bg-fire-100 text-fire-700">
                          <Sparkles size={10} className="inline mr-1" />
                          Premium
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-lg text-surface-900">
                      {business.name}
                    </h3>

                    {business.description && (
                      <p className="text-sm text-surface-500 mt-1">
                        {business.description}
                      </p>
                    )}

                    {business.address && (
                      <p className="text-xs text-surface-400 mt-2 flex items-start gap-1.5">
                        <MapPin size={14} className="shrink-0 mt-0.5" />
                        {business.address}
                      </p>
                    )}

                    {!isPremiumContent && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {business.phone && (
                          <a
                            href={`tel:${business.phone}`}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-50 hover:bg-surface-100 text-surface-700 text-xs font-medium transition-colors"
                          >
                            <Phone size={14} />
                            {formatPhone(business.phone)}
                          </a>
                        )}
                        {business.whatsapp && (
                          <a
                            href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium transition-colors"
                          >
                            <MessageCircle size={14} />
                            WhatsApp
                          </a>
                        )}
                        {business.instagram && (
                          <a
                            href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-medium transition-colors"
                          >
                            <Instagram size={14} />
                            Instagram
                          </a>
                        )}
                        {business.website && (
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ocean-50 hover:bg-ocean-100 text-ocean-700 text-xs font-medium transition-colors"
                          >
                            <Globe size={14} />
                            Site
                          </a>
                        )}
                      </div>
                    )}

                    {isPremiumContent && (
                      <button
                        onClick={openPaymentModal}
                        className="w-full mt-4 py-3 rounded-xl carnival-gradient text-white font-bold text-sm shadow-md active:scale-95 transition-all"
                      >
                        Desbloquear Informações Premium
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
