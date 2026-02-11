'use client';

import { useState, useEffect } from 'react';
import { X, Save, Upload, Music, Image as ImageIcon, Star } from 'lucide-react';
import { supabase, uploadImage } from '@/lib/supabase';
import type { Attraction } from '@/types';

interface AttractionAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Attraction>) => Promise<void>;
    initialData?: Attraction;
}

export default function AttractionAdminModal({ isOpen, onClose, onSave, initialData }: AttractionAdminModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState<Partial<Attraction>>({
        name: '',
        artist: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        start_time: '20:00',
        end_time: '',
        location: 'Arena Paracuru Folia',
        image_url: '',
        is_premium: false,
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
            setImagePreview(initialData.image_url || '');
        } else {
            setFormData({
                name: '',
                artist: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                start_time: '20:00',
                end_time: '',
                location: 'Arena Paracuru Folia',
                location_url: '',
                image_url: '',
                is_premium: false,
                order_index: 0,
            });
            setImagePreview('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione apenas arquivos de imagem');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Imagem muito grande. Tamanho máximo: 5MB');
            return;
        }

        setUploading(true);
        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload to Supabase
            const publicUrl = await uploadImage(file, 'attractions');
            setFormData({ ...formData, image_url: publicUrl });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erro ao fazer upload da imagem');
            setImagePreview('');
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.date) {
            alert('Data é obrigatória');
            return;
        }

        if (!formData.start_time) {
            alert('Horário de início é obrigatório');
            return;
        }

        // Validate end time is after start time
        if (formData.end_time && formData.start_time) {
            if (formData.end_time <= formData.start_time) {
                alert('Horário de término deve ser posterior ao horário de início');
                return;
            }
        }

        setLoading(true);
        try {
            const dataToSave = {
                ...formData,
                name: formData.artist || 'Atração', // Use artist as name, or default
                end_time: formData.end_time || null, // Convert empty string to null
                image_url: formData.image_url || null, // Also handle empty image_url
                location_url: formData.location_url || null,
            };
            await onSave(dataToSave);
            onClose();
        } catch (error) {
            console.error('Error saving attraction:', error);
            alert('Erro ao salvar atração');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-surface-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-surface-900">
                        {initialData ? 'Editar Atração' : 'Nova Atração'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-50 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Imagem da Atração
                        </label>

                        <div className="space-y-4">
                            {/* File Upload */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 px-4 py-2 bg-surface-100 hover:bg-surface-200 text-surface-700 rounded-lg cursor-pointer transition-colors">
                                    <Upload size={20} />
                                    <span>{uploading ? 'Enviando...' : 'Fazer Upload'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-sm text-surface-500">
                                    ou cole a URL abaixo
                                </span>
                            </div>

                            <input
                                type="url"
                                value={formData.image_url || ''}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="https://exemplo.com/imagem.jpg"
                            />
                        </div>

                        {formData.image_url && (
                            <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden bg-surface-50 border border-surface-100">
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-surface-400"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Artist - Moved to be the primary field */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Artista / Banda *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.artist || ''}
                                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="Ex: Luan Santana"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Descrição
                        </label>
                        <textarea
                            rows={3}
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            placeholder="Detalhes sobre a atração..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Data *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            />
                        </div>

                        {/* Start Time */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Horário Início *
                            </label>
                            <input
                                type="time"
                                required
                                value={formData.start_time}
                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Horário Fim
                            </label>
                            <input
                                type="time"
                                value={formData.end_time || ''}
                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Local
                            </label>
                            <input
                                type="text"
                                value={formData.location || ''}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="Ex: Arena Paracuru Folia"
                            />
                        </div>

                        {/* Location URL */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Link do Mapa (Google Maps)
                            </label>
                            <input
                                type="url"
                                value={formData.location_url || ''}
                                onChange={(e) => setFormData({ ...formData, location_url: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="https://maps.google.com/..."
                            />
                        </div>

                        {/* Order Index */}
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Ordem de Exibição
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.order_index || 0}
                                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Is Featured */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={formData.is_featured || false}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                className="w-4 h-4 text-amber-500 rounded border-surface-300 focus:ring-amber-500"
                            />
                            <label htmlFor="is_featured" className="text-sm font-medium text-surface-700 select-none flex items-center gap-1.5">
                                <Star size={14} className="text-amber-500" />
                                Destaque (Exibir com destaque)
                            </label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_premium"
                                checked={formData.is_premium}
                                onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                                className="w-4 h-4 text-carnival-600 rounded border-surface-300 focus:ring-carnival-500"
                            />
                            <label htmlFor="is_premium" className="text-sm font-medium text-surface-700 select-none">
                                Conteúdo Premium (requer acesso pago)
                            </label>
                        </div>
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
                            {loading ? 'Salvando...' : 'Salvar Atração'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
