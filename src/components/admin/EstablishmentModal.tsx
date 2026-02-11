'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Save, Upload, MapPin, Loader2, Image as ImageIcon } from 'lucide-react';
import type { Business, BusinessCategory } from '@/types';
import { CATEGORY_LABELS } from '@/lib/utils';
import { uploadImage } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface EstablishmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Business>) => Promise<void>;
    initialData?: Business;
}

const CATEGORIES: { value: BusinessCategory; label: string }[] = Object.entries(
    CATEGORY_LABELS
).map(([value, label]) => ({
    value: value as BusinessCategory,
    label,
}));

export default function EstablishmentModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}: EstablishmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Partial<Business>>({
        name: '',
        description: '',
        category: 'restaurant',
        address: '',
        phone: '',
        whatsapp: '',
        instagram: '',
        website: '',
        image_url: '',
        latitude: 0,
        longitude: 0,
        is_partner: false,
        is_premium: false,
        is_featured: false,
        order_index: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        } else {
            setFormData({
                name: '',
                description: '',
                category: 'restaurant',
                address: '',
                phone: '',
                whatsapp: '',
                instagram: '',
                website: '',
                image_url: '',
                latitude: 0,
                longitude: 0,
                is_partner: false,
                is_premium: false,
                is_featured: false,
                order_index: 0,
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
            console.error('Error saving establishment:', error);
            alert('Erro ao salvar estabelecimento');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (field: keyof Business, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadImage(file, 'media');
            setFormData((prev) => ({ ...prev, image_url: url }));
            toast.success('Imagem enviada com sucesso!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Erro ao enviar imagem. Tente novamente.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-surface-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-surface-900">
                        {initialData ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-50 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Nome do Estabelecimento *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="Ex: Restaurante Sabor do Mar"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Categoria *
                            </label>
                            <select
                                value={formData.category || 'other'}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Telefone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="(85) 99999-9999"
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
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            placeholder="Fale um pouco sobre o estabelecimento..."
                        />
                    </div>

                    {/* Contact & Social */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                WhatsApp
                            </label>
                            <input
                                type="tel"
                                value={formData.whatsapp || ''}
                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="Apenas números"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Instagram
                            </label>
                            <input
                                type="text"
                                value={formData.instagram || ''}
                                onChange={(e) => handleChange('instagram', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="@usuario"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Website
                            </label>
                            <input
                                type="url"
                                value={formData.website || ''}
                                onChange={(e) => handleChange('website', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Address & Location */}
                    <div className="space-y-4 border-t border-surface-100 pt-4">
                        <h3 className="font-semibold text-surface-800 flex items-center gap-2">
                            <MapPin size={18} /> Endereço e Localização
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Endereço Completo
                            </label>
                            <input
                                type="text"
                                value={formData.address || ''}
                                onChange={(e) => handleChange('address', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                placeholder="Rua, Número, Bairro"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">
                                    Latitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.latitude || ''}
                                    onChange={(e) => handleChange('latitude', parseFloat(e.target.value))}
                                    className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                    placeholder="-3.4..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 mb-1">
                                    Longitude
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.longitude || ''}
                                    onChange={(e) => handleChange('longitude', parseFloat(e.target.value))}
                                    className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                                    placeholder="-39.0..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Imagem do Estabelecimento
                        </label>

                        <div className="space-y-3">
                            {/* Image Preview */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative h-48 w-full rounded-xl overflow-hidden bg-surface-50 border-2 border-dashed border-surface-200 hover:border-carnival-300 hover:bg-surface-100 transition-all cursor-pointer group"
                            >
                                {formData.image_url ? (
                                    <>
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white">
                                                <Upload size={24} />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-surface-400">
                                        <div className="bg-surface-100 p-4 rounded-full mb-3 group-hover:bg-white transition-colors">
                                            <ImageIcon size={32} className="text-surface-400 group-hover:text-carnival-500 transition-colors" />
                                        </div>
                                        <p className="text-sm font-medium">Clique para adicionar uma imagem</p>
                                        <p className="text-xs text-surface-400 mt-1">JPG, PNG ou WEBP</p>
                                    </div>
                                )}

                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                        <Loader2 size={32} className="text-carnival-500 animate-spin mb-2" />
                                        <p className="text-sm font-medium text-surface-600">Enviando imagem...</p>
                                    </div>
                                )}
                            </div>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                                className="hidden"
                            />

                            {/* URL Fallback */}
                            <div className="relative">
                                <input
                                    type="url"
                                    value={formData.image_url || ''}
                                    onChange={(e) => handleChange('image_url', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all text-sm"
                                    placeholder="Ou cole uma URL externa externa aqui..."
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
                                    <ImageIcon size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-surface-100 pt-4">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_partner"
                                checked={formData.is_partner || false}
                                onChange={(e) => handleChange('is_partner', e.target.checked)}
                                className="w-4 h-4 text-carnival-600 rounded border-surface-300 focus:ring-carnival-500"
                            />
                            <label htmlFor="is_partner" className="text-sm font-medium text-surface-700 select-none">
                                Parceiro (Verificado)
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_featured"
                                checked={formData.is_featured || false}
                                onChange={(e) => handleChange('is_featured', e.target.checked)}
                                className="w-4 h-4 text-carnival-600 rounded border-surface-300 focus:ring-carnival-500"
                            />
                            <label htmlFor="is_featured" className="text-sm font-medium text-surface-700 select-none">
                                Destaque
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
                            disabled={loading || uploading}
                            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-carnival-500 hover:bg-carnival-600 active:bg-carnival-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(loading || uploading) ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {loading ? 'Salvando...' : uploading ? 'Enviando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
