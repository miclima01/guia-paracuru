'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Upload, Image as ImageIcon, Loader2, Type, Link as LinkIcon, Hash, MousePointerClick } from 'lucide-react';
import { uploadImage } from '@/actions/admin-actions';
import Image from 'next/image';
import type { Advertisement } from '@/types/advertisement';
import toast from 'react-hot-toast';

interface AdvertisementAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Advertisement>) => Promise<void>;
    initialData?: Advertisement;
}

export default function AdvertisementAdminModal({ isOpen, onClose, onSave, initialData }: AdvertisementAdminModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, handleEscape]);

    const [formData, setFormData] = useState<Partial<Advertisement>>({
        title: '',
        subtitle: '',
        image_url: '',
        link: '',
        button_text: '',
        active: true,
        order_index: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        } else {
            setFormData({
                title: '',
                subtitle: '',
                image_url: '',
                link: '',
                button_text: '',
                active: true,
                order_index: 0,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecione apenas arquivos de imagem');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Imagem muito grande. Tamanho máximo: 5MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const publicUrl = await uploadImage(formData, 'ads');
            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            toast.success('Imagem enviada!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Erro ao fazer upload da imagem');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }

    const handleChange = (field: keyof Advertisement, value: string | number | boolean | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.title?.trim()) {
            toast.error('Título é obrigatório');
            return;
        }

        if (!formData.image_url?.trim()) {
            toast.error('Imagem é obrigatória');
            return;
        }

        setLoading(true);
        try {
            const dataToSave = {
                ...formData,
                subtitle: formData.subtitle || null,
                link: formData.link || null,
                button_text: formData.button_text || null,
            };
            await onSave(dataToSave);
            onClose();
        } catch (error) {
            console.error('Error saving advertisement:', error);
            toast.error('Erro ao salvar anúncio');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-surface-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-bold text-surface-900">
                            {initialData ? 'Editar Anúncio' : 'Novo Anúncio'}
                        </h2>
                        <p className="text-xs text-surface-400 mt-0.5">Preencha as informações do banner publicitário</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Image Upload */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative h-32 w-full rounded-xl overflow-hidden bg-surface-50 border-2 border-dashed border-surface-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all cursor-pointer group"
                    >
                        {formData.image_url ? (
                            <>
                                <Image
                                    src={formData.image_url}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white">
                                        <Upload size={20} />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-surface-400">
                                <div className="bg-surface-100 p-3 rounded-full mb-2 group-hover:bg-white transition-colors">
                                    <ImageIcon size={24} className="text-surface-400 group-hover:text-violet-500 transition-colors" />
                                </div>
                                <p className="text-sm font-medium">Clique para adicionar imagem</p>
                                <p className="text-[10px] text-surface-400">JPG, PNG ou WEBP (máx 5MB)</p>
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                <Loader2 size={28} className="text-violet-500 animate-spin mb-2" />
                                <p className="text-xs font-medium text-surface-600">Enviando...</p>
                            </div>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />

                    {/* Image URL fallback */}
                    <div className="relative">
                        <input
                            type="url"
                            value={formData.image_url || ''}
                            onChange={(e) => handleChange('image_url', e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            placeholder="Ou cole a URL da imagem..."
                        />
                        <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <Type size={12} /> Título *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            placeholder="Ex: Restaurante do João"
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <Type size={12} /> Subtítulo
                        </label>
                        <input
                            type="text"
                            value={formData.subtitle || ''}
                            onChange={(e) => handleChange('subtitle', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            placeholder="Ex: A melhor comida da praia"
                        />
                    </div>

                    {/* Link */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <LinkIcon size={12} /> Link (URL)
                        </label>
                        <input
                            type="url"
                            value={formData.link || ''}
                            onChange={(e) => handleChange('link', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            placeholder="https://exemplo.com"
                        />
                    </div>

                    {/* Button Text */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <MousePointerClick size={12} /> Texto do Botão
                        </label>
                        <input
                            type="text"
                            value={formData.button_text || ''}
                            onChange={(e) => handleChange('button_text', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            placeholder="Ex: Ver mais (padrão se vazio)"
                        />
                    </div>

                    {/* Order & Active */}
                    <div className="flex items-center gap-4">
                        <div className="w-24">
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <Hash size={12} /> Ordem
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.order_index || 0}
                                onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            />
                        </div>

                        <label className="flex items-center gap-3 p-3 mt-5 rounded-xl border border-surface-200 hover:border-green-300 transition-colors cursor-pointer select-none flex-1">
                            <input
                                type="checkbox"
                                checked={formData.active ?? true}
                                onChange={(e) => handleChange('active', e.target.checked)}
                                className="w-4 h-4 text-green-500 rounded border-surface-300 focus:ring-green-500"
                            />
                            <div>
                                <p className="text-sm font-semibold text-surface-700">Ativo</p>
                                <p className="text-[10px] text-surface-400">Exibir no carrossel público</p>
                            </div>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-surface-600 hover:text-surface-800 hover:bg-surface-100 rounded-xl transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-violet-500 hover:bg-violet-600 active:bg-violet-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {(loading || uploading) ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {loading ? 'Salvando...' : 'Salvar Anúncio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
