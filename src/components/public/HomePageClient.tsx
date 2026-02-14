'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import {
    Calendar, MapPin, Newspaper, Phone, Store, ChevronRight,
    Shield, Star, ArrowRight, Music,
    Beer, ShoppingBag, Car
} from 'lucide-react';
import { CATEGORY_LABELS } from '@/lib/utils';
import NewsSlider from '@/components/public/NewsSlider';
import EstablishmentModal from '@/components/public/EstablishmentModal';
import type { NewsArticle, Business, BusinessCategory } from '@/types';

interface HomePageClientProps {
    heroImage: string | null;
    news: NewsArticle[];
    featured: Business[];
    carnivalDates: string;
    location: string;
    supportWhatsapp: string;
}

export default function HomePageClient({
    heroImage,
    news,
    featured,
    carnivalDates,
    location,
    supportWhatsapp,
}: HomePageClientProps) {
    const router = useRouter();
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const quickLinks = [
        { href: '/mapa', icon: MapPin, label: 'Mapa Interativo', desc: 'Todos os locais', color: 'from-sky-400 to-blue-600' },
        { href: '/gastronomia', icon: Beer, label: 'Bares & Restaurantes', desc: 'Onde comer e beber', color: 'from-orange-400 to-orange-600' },
        { href: '/noticias', icon: Newspaper, label: 'Notícias', desc: 'Fique por dentro', color: 'from-rose-700 to-rose-900' },
        { href: '/programacao', icon: Calendar, label: 'Programação', desc: 'Atrações e eventos', color: 'from-fuchsia-500 to-pink-600' },
        { href: '/servicos', icon: ShoppingBag, label: 'Serviços', desc: 'Talvez você precise', color: 'from-emerald-500 to-green-600' },
    ];

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const fadeInVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
                className="px-0 sm:px-4 sm:pt-4 pb-2 max-w-2xl mx-auto"
            >
                <div className="relative overflow-hidden sm:rounded-xl shadow-xl bg-gradient-to-br from-fire-800 to-fire-600">
                    {heroImage && (
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={heroImage}
                                alt="Carnaval Background"
                                className="w-full h-full object-cover"
                                fill
                                sizes="(max-width: 672px) 100vw, 672px"
                                priority
                                loading="eager"
                            />
                            <div className="absolute inset-0 bg-fire-900/70 backdrop-blur-[1px]" />
                        </div>
                    )}
                    <div className={`relative noise ${!heroImage ? 'bg-transparent' : ''}`}>
                        <div className="relative z-10 px-5 pt-12 pb-8 text-center">
                            {/* Logo */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="mb-2 flex justify-center"
                            >
                                <Image
                                    src="/logo.png"
                                    alt="Paracuru Folia 2026"
                                    width={280}
                                    height={280}
                                    className="drop-shadow-xl"
                                    style={{ height: 'auto' }}
                                    priority
                                />
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center justify-center gap-2 mt-4 text-sm text-white/90 font-medium drop-shadow-sm"
                            >
                                <Calendar size={14} />
                                <span>{carnivalDates}</span>
                            </motion.div>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center justify-center gap-2 mt-1 text-sm text-white/70 font-medium drop-shadow-sm"
                            >
                                <MapPin size={14} />
                                <span>{location}</span>
                            </motion.div>

                            {/* CTA */}
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                onClick={() => router.push('/programacao')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm hover:bg-white/25 transition-all shadow-lg"
                            >
                                <Music size={16} />
                                Ver programação completa
                                <ChevronRight size={16} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Quick Links */}
            <section className="mt-8 max-w-2xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex overflow-x-auto gap-3 pb-4 px-4 no-scrollbar"
                >
                    {quickLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <motion.button
                                key={link.href}
                                variants={itemVariants}
                                onClick={() => router.push(link.href)}
                                className="group relative overflow-hidden rounded-xl p-4 text-white shadow-lg active:scale-[0.97] transition-all min-w-[160px] flex-1 text-left"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${link.color}`} />
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start">
                                        <Icon size={22} strokeWidth={2} />
                                    </div>
                                    <p className="font-bold text-sm mt-2 leading-tight">{link.label}</p>
                                    <p className="text-[10px] text-white/70 mt-0.5">{link.desc}</p>
                                </div>
                            </motion.button>
                        );
                    })}
                </motion.div>
            </section>

            {/* News Slider */}
            {news.length > 0 && (
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInVariants}
                    className="px-4 mt-8 max-w-2xl mx-auto"
                >
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
                </motion.section>
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
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 no-scrollbar snap-x"
                    >
                        {featured.map((biz) => (
                            <motion.button
                                key={biz.id}
                                variants={itemVariants}
                                onClick={() => {
                                    setSelectedBusiness(biz);
                                    setIsModalOpen(true);
                                }}
                                className="flex-none w-[242px] h-[242px] snap-center rounded-xl overflow-hidden bg-white shadow-sm border border-surface-100 flex flex-col hover:shadow-md transition-shadow cursor-pointer relative"
                            >
                                <div className="h-[60%] bg-surface-100 overflow-hidden relative">
                                    {biz.image_url ? (
                                        <Image
                                            src={biz.image_url}
                                            alt={biz.name}
                                            className="w-full h-full object-cover"
                                            fill
                                            sizes="(max-width: 768px) 50vw, 242px"
                                        />
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
                            </motion.button>
                        ))}
                    </motion.div>
                </section>
            )}

            {/* Emergency Contacts */}
            <section className="px-4 mt-8 mb-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-lg text-surface-900">Contatos de Emergência</h2>
                    <button
                        onClick={() => router.push('/contatos')}
                        className="text-xs text-fire-600 font-semibold flex items-center gap-1"
                    >
                        Ver todas <ChevronRight size={14} />
                    </button>
                </div>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    {/* Hospital */}
                    <motion.a variants={itemVariants} href="tel:192" className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all top-card">
                        <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center mb-3 shadow-sm">
                            <Store size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-surface-900 leading-tight">Hospital / Pronto Socorro</p>
                            <p className="text-xs text-fire-600 font-bold mt-1 flex items-center gap-1">
                                <Phone size={10} /> 192
                            </p>
                        </div>
                    </motion.a>

                    {/* Police */}
                    <motion.a variants={itemVariants} href="tel:190" className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all top-card">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-3 shadow-sm">
                            <Shield size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-surface-900 leading-tight">RAIO / Polícia</p>
                            <p className="text-xs text-fire-600 font-bold mt-1 flex items-center gap-1">
                                <Phone size={10} /> 190
                            </p>
                        </div>
                    </motion.a>

                    {/* Taxi */}
                    <motion.button
                        variants={itemVariants}
                        onClick={() => router.push('/contatos')}
                        className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all relative overflow-hidden group text-left"
                    >
                        <div className="flex items-start justify-between mb-3 w-full">
                            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center shadow-sm">
                                <Car size={20} className="text-white" />
                            </div>
                        </div>

                        <div className="w-full">
                            <p className="font-bold text-sm text-surface-900 leading-tight">Táxi</p>
                            <div className="flex items-center gap-1 text-xs text-fire-600 font-semibold mt-1 group-hover:underline">
                                Ver lista completa <ChevronRight size={10} />
                            </div>
                        </div>
                    </motion.button>

                    {/* Mototaxi */}
                    <motion.button
                        variants={itemVariants}
                        onClick={() => router.push('/contatos')}
                        className="flex flex-col justify-between h-full min-h-[9rem] p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all relative overflow-hidden group text-left"
                    >
                        <div className="flex items-start justify-between mb-3 w-full">
                            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-sm">
                                <Car size={20} className="text-white" />
                            </div>
                        </div>

                        <div className="w-full">
                            <p className="font-bold text-sm text-surface-900 leading-tight">Mototáxi</p>
                            <div className="flex items-center gap-1 text-xs text-fire-600 font-semibold mt-1 group-hover:underline">
                                Ver lista completa <ChevronRight size={10} />
                            </div>
                        </div>
                    </motion.button>
                </motion.div>
            </section>

            {/* Commercial Opportunity Banner */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
                className="px-4 mb-8 max-w-2xl mx-auto"
            >
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
            </motion.section>

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
