'use client';

import { useEffect, useState, useRef } from 'react';
import { Calendar, Info, MapPin, Music } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/utils';
import { formatCarnivalDateRangeUppercase } from '@/lib/format-dates';
import type { Attraction } from '@/types';
import AttractionCard from '@/components/public/AttractionCard';
import AttractionModal from '@/components/public/AttractionModal';

export default function ProgramacaoPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [carnivalDates, setCarnivalDates] = useState<string>('13 A 17 DE FEVEREIRO, 2026');
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    loadAttractions();
    loadCarnivalDates();
  }, []);

  async function loadCarnivalDates() {
    try {
      const [startRes, endRes] = await Promise.all([
        supabase.from('app_settings').select('value').eq('key', 'carnival_start_date').single(),
        supabase.from('app_settings').select('value').eq('key', 'carnival_end_date').single(),
      ]);

      if (startRes.data?.value && endRes.data?.value) {
        setCarnivalDates(formatCarnivalDateRangeUppercase(startRes.data.value, endRes.data.value));
      }
    } catch (error) {
      console.error('Error loading carnival dates:', error);
    }
  }

  async function loadAttractions() {
    try {
      const { data, error } = await supabase
        .from('attractions')
        .select('id,name,description,date,start_time,end_time,location,artist,image_url,instagram,is_premium,is_featured,latitude,longitude')
        .order('order_index')
        .order('start_time');

      if (data) {
        setAttractions(data as Attraction[]);
        if (data.length > 0 && !selectedDate) {
          // Set default to first date (or today if exists)
          const today = new Date().toISOString().split('T')[0];
          const hasToday = data.some(a => a.date === today);
          setSelectedDate(hasToday ? today : data[0].date);
        }
      }
    } catch (error) {
      console.error('Error loading attractions:', error);
    } finally {
      setLoading(false);
    }
  }

  // Get unique dates and sort them
  const dates = [...new Set(attractions.map((a) => a.date))].sort();
  const filteredAttractions = attractions.filter((a) => a.date === selectedDate);

  // Group by time of day (optional refinement)
  const morning = filteredAttractions.filter(a => parseInt(a.start_time) < 12);
  const afternoon = filteredAttractions.filter(a => parseInt(a.start_time) >= 12 && parseInt(a.start_time) < 18);
  const night = filteredAttractions.filter(a => parseInt(a.start_time) >= 18);

  const sections = [
    { id: 'morning', title: 'Manhã', icon: '☀️', items: morning },
    { id: 'afternoon', title: 'Tarde', icon: '🌅', items: afternoon },
    { id: 'night', title: 'Noite', icon: '🌙', items: night },
  ].filter(s => s.items.length > 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-0 sm:px-4 sm:pt-4 pb-2 max-w-2xl mx-auto"
      >
        <div className="relative bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white sm:rounded-xl shadow-xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e233e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center" />

          <div className="relative z-10 px-5 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
              <Calendar size={24} className="text-white" />
            </div>
            <h1 className="font-display text-3xl mb-2 text-white drop-shadow-md">Programação Oficial</h1>
            <p className="text-white/80">Todos os eventos e atrações do Carnaval de Paracuru</p>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold mt-4 border border-white/10">
              <Calendar size={12} />
              {carnivalDates}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Date Tabs */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="px-4 mt-6 max-w-2xl mx-auto"
      >
        <div
          ref={tabsRef}
          className="flex overflow-x-auto pb-2 gap-2 no-scrollbar scroll-smooth"
        >
          {dates.map((date) => {
            const d = new Date(date + 'T00:00:00');
            const isSelected = date === selectedDate;
            const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0];
            const day = d.getDate();
            const month = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`shrink-0 flex flex-col items-center justify-center min-w-[80px] py-2 px-3 rounded-xl transition-all border ${isSelected
                  ? 'bg-gradient-to-br from-fuchsia-500 to-pink-600 border-transparent text-white shadow-md transform scale-105'
                  : 'bg-white border-surface-200 text-surface-600 hover:border-carnival-300 hover:bg-surface-50'
                  }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">{weekday}</span>
                <span className="text-lg font-display leading-none mt-1">{day} <span className="text-[10px] font-sans font-normal opacity-80 uppercase">{month}</span></span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <div className="container mx-auto max-w-2xl px-4 mt-6 pb-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-surface-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredAttractions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-4 text-surface-400">
              <Music size={32} />
            </div>
            <h3 className="text-surface-900 font-bold text-lg">Nenhuma atração</h3>
            <p className="text-surface-500">Nenhum evento programado para este dia.</p>
          </motion.div>
        ) : (
          <motion.div
            key={selectedDate} // Re-animate when date changes
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {sections.map(section => (
              <motion.div key={section.id} variants={itemVariants}>
                <div className="flex items-center gap-2 mb-4 ml-1">
                  <span className="text-xl">{section.icon}</span>
                  <h2 className="font-display text-xl text-surface-900">{section.title}</h2>
                </div>
                <motion.div
                  variants={containerVariants}
                  className="space-y-4"
                >
                  {section.items.map((attraction) => (
                    <motion.div key={attraction.id} variants={itemVariants}>
                      <AttractionCard
                        attraction={attraction}
                        isPremium={true}
                        onClick={() => {
                          setSelectedAttraction(attraction);
                          setShowModal(true);
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-carnival-50 border border-carnival-100 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-3 text-carnival-700 font-bold">
            <Info size={18} />
            <h3>Importante</h3>
          </div>
          <ul className="text-sm text-surface-700 space-y-2 list-disc list-inside">
            <li>Programação sujeita a alterações sem aviso prévio</li>
            <li>Arena Principal ocorrerá os grandes shows</li>
            <li>Entrada gratuita em todos os eventos</li>
            <li>Menores de 18 anos devem estar acompanhados</li>
          </ul>
        </motion.div>
      </div>

      <AttractionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        attraction={selectedAttraction}
      />
    </div>
  );
}
