'use client';

import { useState, useEffect } from 'react';
import { X, Save, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { NewsArticle } from '@/types';

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<NewsArticle>) => Promise<void>;
    initialData?: NewsArticle;
}

const CATEGORIES = [
    { value: 'geral', label: 'Geral' },
    { value: 'avisos', label: 'Avisos' },
    { value: 'eventos', label: 'Eventos' },
    { value: 'turismo', label: 'Turismo' },
    { value: 'seguranca', label: 'Segurança' },
];

export default function NewsModal({ isOpen, onClose, onSave, initialData }: NewsModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<NewsArticle>>({
        title: '',
        summary: '',
        content: '',
        category: 'geral',
        image_url: '',
        is_featured: false,
        published_at: new Date().toISOString().slice(0, 16),
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                published_at: new Date(initialData.published_at).toISOString().slice(0, 16),
            });
        } else {
            setFormData({
                title: '',
                summary: '',
                content: '',
                category: 'geral',
                image_url: '',
                is_featured: false,
                published_at: new Date().toISOString().slice(0, 16),
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving news:', error);
            alert('Erro ao salvar notícia');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-surface-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-surface-900">
                        {initialData ? 'Editar Notícia' : 'Nova Notícia'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-50 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Título
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            placeholder="Digite o título da notícia"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Categoria
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Published At */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Data de Publicação
                            </label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.published_at}
                                onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            URL da Imagem de Capa
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={formData.image_url || ''}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="flex-1 px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="https://exemplo.com/imagem.jpg"
                            />
                            {/* Future: Add image upload button here */}
                        </div>
                        {formData.image_url && (
                            <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden bg-surface-50 border border-surface-100">
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        )}
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Resumo
                        </label>
                        <textarea
                            required
                            rows={2}
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            placeholder="Breve descrição que aparecerá nos cards..."
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Conteúdo
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all font-mono text-sm"
                            placeholder="Conteúdo completo da notícia (suporta Markdown básico)..."
                        />
                    </div>

                    {/* Is Featured */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_featured"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="w-4 h-4 text-carnival-600 rounded border-surface-300 focus:ring-carnival-500"
                        />
                        <label htmlFor="is_featured" className="text-sm font-medium text-surface-700 select-none">
                            Destacar esta notícia (aparecerá no topo/carrossel)
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-surface-600 hover:text-surface-800 hover:bg-surface-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-carnival-500 hover:bg-carnival-600 active:bg-carnival-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {loading ? 'Salvando...' : 'Salvar Notícia'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
