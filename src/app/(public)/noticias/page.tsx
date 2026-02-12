'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { Newspaper, Star, Instagram, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDateTime, NEWS_CATEGORY_LABELS } from '@/lib/utils';
import type { NewsArticle, NewsCategory } from '@/types';

function getCategoryLabel(category: string): string {
  return NEWS_CATEGORY_LABELS[category as NewsCategory] || category;
}

export default function NoticiasPage() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([
    { id: 'all', label: 'Todas' },
  ]);

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
    loadNews();
  }, []);

  async function loadNews() {
    const { data } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false });

    if (data) {
      setNews(data as NewsArticle[]);
      const customCats = [...new Set(data.map((n: NewsArticle) => n.category))]
        .filter(cat => !(cat in NEWS_CATEGORY_LABELS));
      setCategories([
        { id: 'all', label: 'Todas' },
        ...Object.entries(NEWS_CATEGORY_LABELS).map(([id, label]) => ({ id, label })),
        ...customCats.map(cat => ({ id: cat, label: cat })),
      ]);
    }
    setLoading(false);
  }
  const filteredNews =
    selectedCategory === 'all'
      ? news
      : news.filter((n) => n.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-0 sm:px-4 sm:pt-4 pb-2 max-w-2xl mx-auto"
      >
        <div className="bg-gradient-to-br from-rose-700 to-rose-900 noise sm:rounded-xl shadow-xl">
          <div className="px-5 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/logo-cnp.png"
                alt="Logo CNP"
                width={150}
                height={150}
                className="object-contain drop-shadow-sm"
              />
            </div>
            <h1 className="font-display text-3xl mb-2 text-white">Notícias</h1>
            <p className="text-white/80">Fique por dentro de tudo</p>
          </div>
        </div>
      </motion.section>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="px-4 mt-6 max-w-2xl mx-auto"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${selectedCategory === category.id
                ? 'bg-gradient-to-br from-rose-700 to-rose-900 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* News list */}
      <div className="mt-6 pb-6 px-4 max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredNews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <Newspaper size={48} className="text-surface-300 mx-auto mb-4" />
            <p className="text-surface-400">Nenhuma notícia encontrada</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {filteredNews.map((article) => (
              <motion.div key={article.id} variants={itemVariants}>
                <Link
                  href={`/noticias/${article.id}`}
                  className="block bg-white rounded-xl shadow-sm border border-surface-100 overflow-hidden hover:shadow-md transition-shadow active:scale-[0.99] h-full"
                >
                  {article.image_url && (
                    <div className="h-32 bg-surface-100 overflow-hidden relative">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      {article.is_featured && (
                        <div className="absolute top-2 right-2 bg-sand-400 text-white px-2 py-1 rounded-full text-[9px] font-bold flex items-center gap-1">
                          <Star size={10} fill="currentColor" />
                          Destaque
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-3 text-left">
                    <span className="category-pill bg-fire-100 text-fire-700 text-[9px] px-2 py-0.5">
                      {NEWS_CATEGORY_LABELS[article.category as NewsCategory] || article.category}
                    </span>

                    <h3 className="font-bold text-sm text-surface-900 mt-2 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>

                    <p className="text-xs text-surface-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>

                    <p className="text-[10px] text-surface-400 mt-2">
                      {formatDateTime(article.published_at)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Instagram Banner */}
        <div className="mt-8 mb-6 p-6 rounded-2xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Instagram size={24} className="text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-display text-lg font-bold">Siga @tvcnp_</h3>
                <p className="text-white/90 text-sm">Acompanhe ao vivo no Instagram</p>
              </div>
            </div>
            <a
              href="https://instagram.com/tvcnp_"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-white text-rose-600 rounded-xl font-bold text-sm shadow-sm hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              Seguir no Instagram
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-yellow-400/30 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-600/30 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}
