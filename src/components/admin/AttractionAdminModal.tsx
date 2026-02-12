'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Save, Upload, Music, Image as ImageIcon, Star, Calendar, Clock, MapPin, Loader2, AlignLeft, Hash } from 'lucide-react';
import { supabase, uploadImage } from '@/lib/supabase';
import type { Attraction } from '@/types';
import toast from 'react-hot-toast';

interface AttractionAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Attraction>) => Promise<void>;
    initialData?: Attraction;
}

export default function AttractionAdminModal({ isOpen, onClose, onSave, initialData }: AttractionAdminModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Partial<Attraction>>({
        name: '',
        artist: '',
        description: '',
        instagram: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '20:00',
        end_time: '',
        location: 'Arena Paracuru Folia',
        latitude: null,
        longitude: null,
        image_url: '',
        is_premium: false,
        is_featured: false,
        order_index: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                date: initialData.date,
                start_time: initialData.start_time || '20:00',
                end_time: initialData.end_time || '',
            });
        } else {
            setFormData({
                name: '',
                artist: '',
                description: '',
                instagram: '',
                date: new Date().toISOString().split('T')[0],
                start_time: '20:00',
                end_time: '',
                location: 'Arena Paracuru Folia',
                latitude: null,
                longitude: null,
                image_url: '',
                is_premium: false,
                is_featured: false,
                order_index: 0,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Por favor, selecione apenas arquivos de imagem');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Imagem muito grande. Tamanho máximo: 5MB');
            return;
        }

        setUploading(true);
        try {
            const publicUrl = await uploadImage(file, 'attractions');
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

    const handleChange = (field: keyof Attraction, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.date) {
            toast.error('Data é obrigatória');
            return;
        }

        if (!formData.start_time) {
            toast.error('Horário de início é obrigatório');
            return;
        }

        if (formData.end_time && formData.start_time) {
            if (formData.end_time <= formData.start_time && !formData.end_time.startsWith('0')) {
                // Simple check, assumes same day unless early morning next day (starts with 0)
                // This is a loose check, relied on user common sense mostly for now
            }
        }

        setLoading(true);
        try {
            const dataToSave = {
                ...formData,
                name: formData.artist || 'Atração', // Use artist as name if empty
                end_time: formData.end_time || null,
                image_url: formData.image_url || null,
                instagram: formData.instagram || null,
                latitude: formData.latitude || null,
                longitude: formData.longitude || null,
            };
            await onSave(dataToSave);
            onClose();
        } catch (error) {
            console.error('Error saving attraction:', error);
            toast.error('Erro ao salvar atração');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-surface-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-bold text-surface-900">
                            {initialData ? 'Editar Atração' : 'Nova Atração'}
                        </h2>
                        <p className="text-xs text-surface-400 mt-0.5">Preencha as informações do show/evento</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Image */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="relative h-40 w-full rounded-xl overflow-hidden bg-surface-50 border-2 border-dashed border-surface-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all cursor-pointer group"
                    >
                        {formData.image_url ? (
                            <>
                                <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
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
                                <p className="text-sm font-medium">Clique para adicionar imagem do artista</p>
                                <p className="text-[10px] text-surface-400">JPG, PNG ou WEBP</p>
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

                    {/* URL fallback */}
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

                    {/* Artist / Name */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <Music size={12} /> Artista / Banda *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.artist || ''}
                            onChange={(e) => handleChange('artist', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            placeholder="Ex: Luan Santana"
                        />
                    </div>

                    {/* Instagram */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <Hash size={12} /> Instagram (Usuário)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-sm font-medium">@</span>
                            <input
                                type="text"
                                value={formData.instagram || ''}
                                onChange={(e) => handleChange('instagram', e.target.value.replace(/^@/, ''))}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                                placeholder="usuario"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <AlignLeft size={12} /> Biografia / Descrição
                        </label>
                        <textarea
                            rows={2}
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm resize-none"
                            placeholder="Detalhes sobre a atração..."
                        />
                    </div>

                    {/* Date & Time Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <Calendar size={12} /> Data *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date || ''}
                                onChange={(e) => handleChange('date', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <Clock size={12} /> Início *
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.start_time || ''}
                                onChange={(e) => handleChange('start_time', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <Clock size={12} /> Término
                            </label>
                            <input
                                type="time"
                                value={formData.end_time || ''}
                                onChange={(e) => handleChange('end_time', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-surface-50 rounded-xl p-4 space-y-3">
                        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wide flex items-center gap-1.5">
                            <MapPin size={12} /> Localização
                        </h3>
                        <input
                            type="text"
                            value={formData.location || ''}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                            placeholder="Nome do local (ex: Arena Paracuru Folia)"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                step="any"
                                value={formData.latitude ?? ''}
                                onChange={(e) => handleChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                                placeholder="Latitude"
                            />
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude ?? ''}
                                onChange={(e) => handleChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-sm"
                                placeholder="Longitude"
                            />
                        </div>
                    </div>

                    {/* Order & Featured */}
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

                        <label className="flex items-center gap-3 p-3 mt-5 rounded-xl border border-surface-200 hover:border-amber-300 transition-colors cursor-pointer select-none flex-1">
                            <input
                                type="checkbox"
                                checked={formData.is_featured || false}
                                onChange={(e) => handleChange('is_featured', e.target.checked)}
                                className="w-4 h-4 text-amber-500 rounded border-surface-300 focus:ring-amber-500"
                            />
                            <Star size={16} className="text-amber-500" />
                            <div>
                                <p className="text-sm font-semibold text-surface-700">Destaque</p>
                                <p className="text-[10px] text-surface-400">Exibir com destaque na lista</p>
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
                            {loading ? 'Salvando...' : 'Salvar Atração'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
