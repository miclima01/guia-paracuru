'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDateTime, NEWS_CATEGORY_LABELS } from '@/lib/utils';
import type { NewsArticle, NewsCategory } from '@/types';

export default function NoticiaDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [params.id]);

  async function loadArticle() {
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('id', params.id)
      .single();

    if (data) setArticle(data);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-surface-500 mb-4">Notícia não encontrada</p>
        <button
          onClick={() => router.back()}
          className="btn-primary"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center active:scale-95 transition-all"
        >
          <ArrowLeft size={20} className="text-surface-900" />
        </button>

        {article.image_url && (
          <div className="h-64 bg-surface-100 overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 mt-6 max-w-2xl mx-auto">
        <span className="category-pill bg-fire-100 text-fire-700">
          {NEWS_CATEGORY_LABELS[article.category as NewsCategory] || article.category}
        </span>

        <h1 className="font-display text-2xl text-surface-900 mt-3 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-2 mt-4 text-sm text-surface-400">
          <Calendar size={14} />
          {formatDateTime(article.published_at)}
        </div>

        <div className="mt-6 prose prose-sm max-w-none">
          <p className="text-base text-surface-600 font-medium leading-relaxed">
            {article.summary}
          </p>

          <div
            className="mt-6 text-surface-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </div>
  );
}
