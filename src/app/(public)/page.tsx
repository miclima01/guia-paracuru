'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Calendar, MapPin, Newspaper, Phone, Store, ChevronRight,
  Clock, Shield, Star, Sparkles, ArrowRight, Music,
  Beer, ShoppingBag, Car, Lock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDateTime, EMERGENCY_ICONS, CATEGORY_LABELS, formatPhone } from '@/lib/utils';
import { useAppStore } from '@/hooks/useStore';
import PremiumGate from '@/components/public/PremiumGate';
import NewsSlider from '@/components/public/NewsSlider';
import EstablishmentModal from '@/components/public/EstablishmentModal';

import type { NewsArticle, Business, EmergencyContact, BusinessCategory } from '@/types';

export default function HomePage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [featured, setFeatured] = useState<Business[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [heroImage, setHeroImage] = useState<string | null>(null);
  const { isPremium, openPaymentModal } = useAppStore();

  useEffect(() => {
    // Fetch main content
    Promise.all([
      supabase.from('news').select('*').order('published_at', { ascending: false }).limit(3),
      supabase.from('businesses').select('*').eq('is_featured', true).order('order_index').limit(4),
      supabase.from('emergency_contacts').select('*').order('order_index').limit(4),
    ]).then(([newsRes, bizRes, contactRes]) => {
      if (newsRes.data) setNews(newsRes.data);
      if (bizRes.data) setFeatured(bizRes.data);
      if (contactRes.data) setContacts(contactRes.data);
    }).catch(err => {
      console.error('Error fetching home data:', err);
    });

    // Fetch settings independently to avoid blocking main content
    (async () => {
      try {
        const { data } = await supabase.from('app_settings').select('value').eq('key', 'hero_background_image').single();
        if (data) setHeroImage(data.value);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    })();
  }, []);

  const quickLinks = [
    { href: '/mapa', icon: MapPin, label: 'Mapa Interativo', desc: 'Todos os locais', color: 'from-sky-400 to-blue-600' },
    { href: '/gastronomia', icon: Beer, label: 'Bares & Restaurantes', desc: 'Onde comer e beber', color: 'from-orange-400 to-orange-600' },
    { href: '/noticias', icon: Newspaper, label: 'Notícias', desc: 'Fique por dentro', color: 'from-violet-500 to-purple-700' },
    { href: '/programacao', icon: Calendar, label: 'Programação', desc: 'Atrações e eventos', color: 'from-fuchsia-500 to-pink-600' },
    { href: '/servicos', icon: ShoppingBag, label: 'Serviços', desc: 'Talvez você precise', color: 'from-emerald-500 to-green-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      {/* Hero */}
      <section className="px-4 pt-4 pb-2 max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-xl shadow-xl carnival-gradient-dark">
          {heroImage && (
            <div className="absolute inset-0 z-0">
              <img
                src={heroImage}
                alt="Carnaval Background"
                className="w-full h-full object-cover"
                onError={() => setHeroImage(null)}
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            </div>
          )}
          <div className={`relative noise ${!heroImage ? 'carnival-gradient-dark' : ''}`}>
            <div className="relative z-10 px-5 pt-12 pb-8 text-center">
              {/* Logo area */}
              <div className="mb-2">
                <h1 className="font-display text-4xl text-white tracking-tight leading-none drop-shadow-lg">
                  PARACURU
                </h1>
                <p className="font-display text-lg text-carnival-200 tracking-widest drop-shadow-md">
                  FOLIA 2026
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/90 font-medium drop-shadow-sm">
                <Calendar size={14} />
                <span>13 a 17 de Fevereiro, 2026</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1 text-sm text-white/70 font-medium drop-shadow-sm">
                <MapPin size={14} />
                <span>Paracuru, Ceará - Brasil</span>
              </div>

              {/* CTA */}
              <button
                onClick={(e) => {
                  if (!isPremium) {
                    e.preventDefault();
                    openPaymentModal();
                  } else {
                    window.location.href = '/programacao';
                  }
                }}
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm hover:bg-white/25 transition-all active:scale-95 shadow-lg"
              >
                {!isPremium ? <Lock size={16} className="text-yellow-400" /> : <Music size={16} />}
                Ver programação completa
                {!isPremium ? null : <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="mt-8 max-w-2xl mx-auto pl-4">
        <div className="flex overflow-x-auto gap-3 pb-4 pr-4 no-scrollbar">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.href}
                onClick={() => {
                  if (!isPremium) {
                    openPaymentModal();
                  } else {
                    window.location.href = link.href;
                  }
                }}
                className="group relative overflow-hidden rounded-xl p-4 text-white shadow-lg active:scale-[0.97] transition-all min-w-[160px] flex-1 text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color}`} />
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <Icon size={22} strokeWidth={2} />
                    {!isPremium && <Lock size={16} className="text-white/80" />}
                  </div>
                  <p className="font-bold text-sm mt-2 leading-tight">{link.label}</p>
                  <p className="text-[10px] text-white/70 mt-0.5">{link.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* News Slider */}
      {news.length > 0 && (
        <section className="px-4 mt-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-surface-900">Últimas Notícias</h2>
            <button
              onClick={() => !isPremium ? openPaymentModal() : window.location.href = '/noticias'}
              className="text-xs text-fire-600 font-semibold flex items-center gap-1"
            >
              {!isPremium && <Lock size={12} />}
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <div className="relative" onClickCapture={(e) => {
            if (!isPremium) {
              e.preventDefault();
              e.stopPropagation();
              openPaymentModal();
            }
          }}>
            {!isPremium && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/5 backdrop-blur-[1px] rounded-xl border border-white/20">
                <div className="bg-black/60 p-2 rounded-full backdrop-blur-md">
                  <Lock size={24} className="text-white" />
                </div>
              </div>
            )}
            <NewsSlider news={news} />
          </div>
        </section>
      )}

      {/* Next Attractions */}


      {/* Featured Businesses */}
      {featured.length > 0 && (
        <section className="px-4 mt-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-surface-900 flex items-center gap-2">
              <Star size={16} className="text-sand-500" />
              Destaques
            </h2>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 no-scrollbar snap-x">
            {featured.map((biz) => (
              <button
                key={biz.id}
                onClick={() => {
                  if (!isPremium) {
                    openPaymentModal();
                  } else {
                    setSelectedBusiness(biz);
                    setIsModalOpen(true);
                  }
                }}
                className="flex-none w-[242px] h-[242px] snap-center rounded-xl overflow-hidden bg-white shadow-sm border border-surface-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer relative"
              >
                {!isPremium && (
                  <div className="absolute top-2 right-2 z-20 bg-black/60 p-1.5 rounded-full backdrop-blur-sm">
                    <Lock size={14} className="text-white" />
                  </div>
                )}
                <div className="h-[60%] bg-surface-100 overflow-hidden relative">
                  {biz.image_url ? (
                    <img src={biz.image_url} alt={biz.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                      <Store size={28} />
                    </div>
                  )}
                  {biz.is_partner && (
                    <div className="absolute top-2 left-2">
                      <span className="category-pill bg-white/90 text-carnival-700 shadow-sm backdrop-blur-sm text-[10px] px-2 py-1">Parceiro</span>
                    </div>
                  )}
                </div>
                <div className="h-[40%] p-4 flex flex-col justify-center bg-white text-left">
                  <p className="font-bold text-sm text-surface-900 leading-tight mb-1 line-clamp-2">{biz.name}</p>
                  <p className="text-xs text-surface-500 line-clamp-2 leading-relaxed">{biz.description || CATEGORY_LABELS[biz.category as BusinessCategory]}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Emergency Contacts */}
      <section className="px-4 mt-8 mb-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-surface-900">Contatos de Emergência</h2>
          <button onClick={() => !isPremium ? openPaymentModal() : window.location.href = '/contatos'} className="text-xs text-fire-600 font-semibold flex items-center gap-1">
            {!isPremium && <Lock size={12} />}
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Hospital */}
          <a href="tel:192" className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all top-card">
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center mb-3 shadow-sm">
              <Store size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-surface-900 leading-tight">Hospital / Pronto Socorro</p>
              <p className="text-xs text-fire-600 font-bold mt-1 flex items-center gap-1">
                <Phone size={10} /> 192
              </p>
            </div>
          </a>

          {/* Police */}
          <a href="tel:190" className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all top-card">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-3 shadow-sm">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-surface-900 leading-tight">RAIO / Polícia</p>
              <p className="text-xs text-fire-600 font-bold mt-1 flex items-center gap-1">
                <Phone size={10} /> 190
              </p>
            </div>
          </a>

          {/* Taxi */}
          <button onClick={() => !isPremium ? openPaymentModal() : window.location.href = '/contatos'} className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all relative overflow-hidden group text-left">
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm">
                <Car size={20} className="text-white" />
              </div>
              <div className="bg-amber-100 text-amber-700 p-1 rounded-md">
                {!isPremium ? <Lock size={12} className="text-amber-500" /> : <Shield size={12} fill="currentColor" className="text-amber-500" />}
              </div>
            </div>

            <div className="w-full">
              <p className="font-bold text-sm text-surface-900 leading-tight">Táxi</p>
              <div className="flex items-center gap-1 text-xs text-fire-600 font-semibold mt-1 group-hover:underline">
                Ver lista completa <ChevronRight size={10} />
              </div>
              <p className="text-[10px] text-surface-400 mt-1 uppercase tracking-wide font-medium">Premium</p>
            </div>
          </button>

          {/* Mototaxi */}
          <button onClick={() => !isPremium ? openPaymentModal() : window.location.href = '/contatos'} className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all relative overflow-hidden group text-left">
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-sm">
                <Car size={20} className="text-white" />
              </div>
              <div className="bg-amber-100 text-amber-700 p-1 rounded-md">
                {!isPremium ? <Lock size={12} className="text-amber-500" /> : <Shield size={12} fill="currentColor" className="text-amber-500" />}
              </div>
            </div>

            <div className="w-full">
              <p className="font-bold text-sm text-surface-900 leading-tight">Mototáxi</p>
              <div className="flex items-center gap-1 text-xs text-fire-600 font-semibold mt-1 group-hover:underline">
                Ver lista completa <ChevronRight size={10} />
              </div>
              <p className="text-[10px] text-surface-400 mt-1 uppercase tracking-wide font-medium">Premium</p>
            </div>
          </button>
        </div>
      </section>



      {/* Premium CTA */}
      {!isPremium && (
        <section className="px-4 mb-8 max-w-2xl mx-auto">
          <button
            onClick={openPaymentModal}
            className="w-full relative overflow-hidden rounded-xl p-6 text-left"
          >
            <div className="absolute inset-0 carnival-gradient-dark" />
            <div className="absolute inset-0 premium-shimmer" />
            <div className="relative z-10">
              <h3 className="font-display text-lg text-white mt-2">Acesso Premium</h3>
              <p className="text-sm text-white/70 mt-1">
                Desbloqueie toda a programação, contatos de transporte e mais por apenas R$ 1,99.
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-sm font-bold text-white">
                Desbloquear agora <ArrowRight size={14} />
              </span>
            </div>
          </button>
        </section>
      )}

      {/* Establishment Modal */}
      <EstablishmentModal
        business={selectedBusiness}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBusiness(null);
        }}
      />

      {/* Attraction Modal */}

    </div>
  );
}
