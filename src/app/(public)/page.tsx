'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Calendar, MapPin, Newspaper, Phone, Store, ChevronRight,
  Shield, Star, ArrowRight, Music,
  Beer, ShoppingBag, Car, Lock
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CATEGORY_LABELS } from '@/lib/utils';
import { formatCarnivalDateRange, formatLocation } from '@/lib/format-dates';
import { useAppStore } from '@/hooks/useStore';
import NewsSlider from '@/components/public/NewsSlider';
import EstablishmentModal from '@/components/public/EstablishmentModal';

import type { NewsArticle, Business, BusinessCategory } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [featured, setFeatured] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [supportWhatsapp, setSupportWhatsapp] = useState('');
  const [carnivalDates, setCarnivalDates] = useState('13 a 17 de Fevereiro, 2026');
  const [location, setLocation] = useState('Paracuru, Ceará - Brasil');
  const { isPremium, openPaymentModal } = useAppStore();

  useEffect(() => {
    // Fetch main content
    Promise.all([
      supabase.from('news').select('id,title,summary,image_url,category,published_at').order('published_at', { ascending: false }).limit(3),
      supabase.from('businesses').select('*').eq('is_featured', true).order('order_index').limit(4),
    ]).then(([newsRes, bizRes]) => {
      if (newsRes.data) setNews(newsRes.data as NewsArticle[]);
      if (bizRes.data) setFeatured(bizRes.data as Business[]);
    });

    // Fetch settings independently to avoid blocking main content
    (async () => {
      try {
        const [heroRes, whatsappRes, startDateRes, endDateRes, cityRes, stateRes] = await Promise.all([
          supabase.from('app_settings').select('value').eq('key', 'hero_background_image').single(),
          supabase.from('app_settings').select('value').eq('key', 'support_whatsapp').single(),
          supabase.from('app_settings').select('value').eq('key', 'carnival_start_date').single(),
          supabase.from('app_settings').select('value').eq('key', 'carnival_end_date').single(),
          supabase.from('app_settings').select('value').eq('key', 'city_name').single(),
          supabase.from('app_settings').select('value').eq('key', 'state').single(),
        ]);

        if (heroRes.data) setHeroImage(heroRes.data.value);
        if (whatsappRes.data?.value) setSupportWhatsapp(whatsappRes.data.value);

        if (startDateRes.data?.value && endDateRes.data?.value) {
          setCarnivalDates(formatCarnivalDateRange(startDateRes.data.value, endDateRes.data.value));
        }

        if (cityRes.data?.value && stateRes.data?.value) {
          setLocation(formatLocation(cityRes.data.value, stateRes.data.value));
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    })();
  }, []);

  const freeRoutes = ['/noticias', '/programacao', '/mapa', '/gastronomia', '/servicos', '/contatos'];
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
      <section className="px-4 pt-4 pb-2 max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-xl shadow-xl bg-gradient-to-br from-fire-800 to-fire-600">
          {heroImage && (
            <div className="absolute inset-0 z-0">
              <Image
                src={heroImage}
                alt="Carnaval Background"
                className="w-full h-full object-cover"
                fill
                sizes="(max-width: 672px) 100vw, 672px"
                priority
                onError={() => setHeroImage(null)}
              />
              <div className="absolute inset-0 bg-fire-900/70 backdrop-blur-[1px]" />
            </div>
          )}
          <div className={`relative noise ${!heroImage ? 'bg-transparent' : ''}`}>
            <div className="relative z-10 px-5 pt-12 pb-8 text-center">
              {/* Logo */}
              <div className="mb-2 flex justify-center">
                <Image
                  src="/logo.png"
                  alt="Paracuru Folia 2026"
                  width={280}
                  height={280}
                  className="drop-shadow-xl"
                  priority
                />
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-white/90 font-medium drop-shadow-sm">
                <Calendar size={14} />
                <span>{carnivalDates}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-1 text-sm text-white/70 font-medium drop-shadow-sm">
                <MapPin size={14} />
                <span>{location}</span>
              </div>

              {/* CTA */}
              <button
                onClick={() => router.push('/programacao')}
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm hover:bg-white/25 transition-all active:scale-95 shadow-lg"
              >
                <Music size={16} />
                Ver programação completa
                <ChevronRight size={16} />
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
            const isFree = freeRoutes.includes(link.href);
            return (
              <button
                key={link.href}
                onClick={() => {
                  if (!isFree && !isPremium) {
                    openPaymentModal();
                  } else {
                    router.push(link.href);
                  }
                }}
                className="group relative overflow-hidden rounded-xl p-4 text-white shadow-lg active:scale-[0.97] transition-all min-w-[160px] flex-1 text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color}`} />
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <Icon size={22} strokeWidth={2} />
                    {!isFree && !isPremium && <Lock size={16} className="text-white/80" />}
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
              onClick={() => router.push('/noticias')}
              className="text-xs text-fire-600 font-semibold flex items-center gap-1"
            >
              Ver todas <ChevronRight size={14} />
            </button>
          </div>
          <NewsSlider news={news} supportWhatsapp={supportWhatsapp} />
        </section>
      )}

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
                  setSelectedBusiness(biz);
                  setIsModalOpen(true);
                }}
                className="flex-none w-[242px] h-[242px] snap-center rounded-xl overflow-hidden bg-white shadow-sm border border-surface-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer relative"
              >
                <div className="h-[60%] bg-surface-100 overflow-hidden relative">
                  {biz.image_url ? (
                    <Image src={biz.image_url} alt={biz.name} className="w-full h-full object-cover" fill sizes="242px" />
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
                  {biz.rating && biz.rating > 0 && (
                    <div className="flex items-center gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={`${i < Math.round(biz.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-surface-200'}`}
                        />
                      ))}
                      <span className="text-[10px] text-surface-500 font-medium ml-1">({biz.rating})</span>
                    </div>
                  )}
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
          <button onClick={() => router.push('/contatos')} className="text-xs text-fire-600 font-semibold flex items-center gap-1">
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
          <button onClick={() => router.push('/contatos')} className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all relative overflow-hidden group text-left">
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm">
                <Car size={20} className="text-white" />
              </div>
              {!isPremium && (
                <div className="bg-amber-100 text-amber-700 p-1 rounded-md">
                  <Lock size={12} className="text-amber-500" />
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="font-bold text-sm text-surface-900 leading-tight">Táxi</p>
              <div className="flex items-center gap-1 text-xs text-fire-600 font-semibold mt-1 group-hover:underline">
                Ver lista completa <ChevronRight size={10} />
              </div>
            </div>
          </button>

          {/* Mototaxi */}
          <button onClick={() => router.push('/contatos')} className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all relative overflow-hidden group text-left">
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-sm">
                <Car size={20} className="text-white" />
              </div>
              {!isPremium && (
                <div className="bg-amber-100 text-amber-700 p-1 rounded-md">
                  <Lock size={12} className="text-amber-500" />
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="font-bold text-sm text-surface-900 leading-tight">Mototáxi</p>
              <div className="flex items-center gap-1 text-xs text-fire-600 font-semibold mt-1 group-hover:underline">
                Ver lista completa <ChevronRight size={10} />
              </div>
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
              <h3 className="font-display text-lg font-semibold text-white mt-2">Acesso Premium</h3>
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

      {/* Commercial Opportunity Banner */}
      <section className="px-4 mb-8 max-w-2xl mx-auto">
        <a
          href={`https://wa.me/55${supportWhatsapp.replace(/\D/g, '')}?text=Olá! Gostaria de anunciar no Guia do Carnaval.`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full relative overflow-hidden rounded-xl p-6 text-left shadow-lg active:scale-[0.98] transition-all group"
        >
          {/* Background - Green Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-500" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

          <div className="relative z-10">
            <h3 className="font-display text-lg font-semibold text-white mt-2">
              Coloque sua marca na frente de milhares de foliões
            </h3>

            <p className="text-sm text-white/70 mt-1 mb-4 max-w-[90%]">
              Divulgue no guia oficial do Carnaval e destaque seu negócio.
            </p>

            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-600 text-sm font-bold shadow-sm group-hover:bg-surface-50 transition-colors">
              Anunciar agora <ArrowRight size={14} />
            </span>
          </div>
        </a>
      </section>

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
