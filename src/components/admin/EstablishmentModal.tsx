'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Save, Upload, MapPin, Loader2, Image as ImageIcon, Plus, MessageCircle, AtSign, Globe, Phone, Star, ShieldCheck, Tag, Clock } from 'lucide-react';
import type { Business } from '@/types';
import { CATEGORY_LABELS } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { uploadImage } from '@/actions/admin-actions';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface EstablishmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Business>) => Promise<void>;
    initialData?: Business;
}

export default function EstablishmentModal({
    isOpen,
    onClose,
    onSave,
    initialData,
}: EstablishmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [extraCategories, setExtraCategories] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const newCatRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<Partial<Business>>({
        name: '',
        description: '',
        category: 'restaurant',
        address: '',
        opening_hours: '',
        phone: '',
        whatsapp: '',
        instagram: '',
        website: '',
        image_url: '',
        latitude: null,
        longitude: null,
        is_partner: false,
        is_premium: false,
        is_featured: false,
        order_index: 0,
    });

    const allCategories: Record<string, string> = {
        ...CATEGORY_LABELS,
        ...extraCategories,
    };

    // Load custom categories from DB
    useEffect(() => {
        async function loadCategories() {
            const { data } = await supabase
                .from('businesses')
                .select('category');
            if (data) {
                const custom: Record<string, string> = {};
                data.forEach((row: { category: string }) => {
                    if (!(row.category in CATEGORY_LABELS) && row.category) {
                        custom[row.category] = row.category;
                    }
                });
                setExtraCategories(custom);
            }
        }
        if (isOpen) loadCategories();
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        } else {
            setFormData({
                name: '',
                description: '',
                category: 'restaurant',
                address: '',
                opening_hours: '',
                phone: '',
                whatsapp: '',
                instagram: '',
                website: '',
                image_url: '',
                latitude: null,
                longitude: null,
                is_partner: false,
                is_premium: false,
                is_featured: false,
                order_index: 0,
            });
        }
        setIsAddingCategory(false);
        setNewCategoryName('');
    }, [initialData, isOpen]);

    useEffect(() => {
        if (isAddingCategory && newCatRef.current) {
            newCatRef.current.focus();
        }
    }, [isAddingCategory]);

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
            const formData = new FormData();
            formData.append('file', file);
            const url = await uploadImage(formData, 'establishments');
            setFormData((prev) => ({ ...prev, image_url: url }));
            toast.success('Imagem enviada!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Erro ao enviar imagem.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    function addCategory() {
        const name = newCategoryName.trim();
        if (!name) return;
        const slug = name.toLowerCase().replace(/\s+/g, '_').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        setExtraCategories(prev => ({ ...prev, [slug]: name }));
        handleChange('category', slug);
        setNewCategoryName('');
        setIsAddingCategory(false);
    }

    async function deleteCategory(slug: string) {
        const { count } = await supabase
            .from('businesses')
            .select('id', { count: 'exact', head: true })
            .eq('category', slug);

        if (count && count > 0) {
            toast.error(`Não é possível excluir: ${count} estabelecimento(s) usa(m) esta categoria.`);
            return;
        }

        setExtraCategories(prev => {
            const next = { ...prev };
            delete next[slug];
            return next;
        });

        if (formData.category === slug) {
            handleChange('category', Object.keys(CATEGORY_LABELS)[0]);
        }

        toast.success('Categoria removida.');
    }

    const isCustom = (slug: string) => !(slug in CATEGORY_LABELS);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-surface-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-bold text-surface-900">
                            {initialData ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}
                        </h2>
                        <p className="text-xs text-surface-400 mt-0.5">Preencha as informações do estabelecimento</p>
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
                        className="relative h-40 w-full rounded-xl overflow-hidden bg-surface-50 border-2 border-dashed border-surface-200 hover:border-carnival-300 hover:bg-orange-50/30 transition-all cursor-pointer group"
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
                                    <ImageIcon size={24} className="text-surface-400 group-hover:text-carnival-500 transition-colors" />
                                </div>
                                <p className="text-sm font-medium">Clique para adicionar imagem</p>
                                <p className="text-[10px] text-surface-400">JPG, PNG ou WEBP</p>
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                <Loader2 size={28} className="text-carnival-500 animate-spin mb-2" />
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
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                            placeholder="Ou cole a URL da imagem..."
                        />
                        <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            Nome do Estabelecimento *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                            placeholder="Ex: Restaurante Sabor do Mar"
                        />
                    </div>

                    {/* Category pills */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
                            <Tag size={12} /> Categoria *
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(allCategories).map(([slug, label]) => (
                                <div key={slug} className="relative group/cat">
                                    <button
                                        type="button"
                                        onClick={() => handleChange('category', slug)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${formData.category === slug
                                            ? 'bg-carnival-500 text-white border-carnival-500 shadow-sm'
                                            : 'bg-white text-surface-600 border-surface-200 hover:border-carnival-300 hover:text-carnival-700'
                                            } ${isCustom(slug) ? 'pr-7' : ''}`}
                                    >
                                        {label}
                                    </button>
                                    {isCustom(slug) && (
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); deleteCategory(slug); }}
                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                            title="Excluir categoria"
                                        >
                                            <X size={10} />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {isAddingCategory ? (
                                <div className="flex items-center gap-1.5">
                                    <input
                                        ref={newCatRef}
                                        type="text"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') { e.preventDefault(); addCategory(); }
                                            if (e.key === 'Escape') { setIsAddingCategory(false); setNewCategoryName(''); }
                                        }}
                                        className="px-3 py-1.5 rounded-lg text-xs border border-carnival-300 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none w-32"
                                        placeholder="Nova categoria"
                                    />
                                    <button type="button" onClick={addCategory} className="p-1.5 rounded-lg bg-carnival-500 text-white hover:bg-carnival-600 transition-colors">
                                        <Plus size={12} />
                                    </button>
                                    <button type="button" onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); }} className="p-1.5 rounded-lg bg-surface-100 text-surface-500 hover:bg-surface-200 transition-colors">
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCategory(true)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-dashed border-surface-300 text-surface-400 hover:border-carnival-400 hover:text-carnival-600 hover:bg-orange-50 transition-all flex items-center gap-1"
                                >
                                    <Plus size={12} /> Nova
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            Descrição
                        </label>
                        <textarea
                            rows={2}
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm resize-none"
                            placeholder="Fale um pouco sobre o estabelecimento..."
                        />
                    </div>



                    {/* Opening Hours */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <Clock size={12} /> Horário de Funcionamento
                        </label>
                        <input
                            type="text"
                            value={formData.opening_hours || ''}
                            onChange={(e) => handleChange('opening_hours', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                            placeholder="Ex: Seg a Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00"
                        />
                    </div>

                    {/* Contact & Social */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <Phone size={12} /> Telefone
                            </label>
                            <input
                                type="tel"
                                value={formData.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                                placeholder="(85) 99999-9999"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <MessageCircle size={12} /> WhatsApp
                            </label>
                            <input
                                type="tel"
                                value={formData.whatsapp || ''}
                                onChange={(e) => handleChange('whatsapp', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                                placeholder="85999999999"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <AtSign size={12} /> Instagram
                            </label>
                            <input
                                type="text"
                                value={formData.instagram || ''}
                                onChange={(e) => handleChange('instagram', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                                placeholder="@usuario"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <Globe size={12} /> Website
                            </label>
                            <input
                                type="url"
                                value={formData.website || ''}
                                onChange={(e) => handleChange('website', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="w-32">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <Star size={12} /> Nota (0-5)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.rating || ''}
                            onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                            placeholder="4.8"
                        />
                    </div>

                    {/* Address & Location */}
                    <div className="bg-surface-50 rounded-xl p-4 space-y-3">
                        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wide flex items-center gap-1.5">
                            <MapPin size={12} /> Localização
                        </h3>
                        <input
                            type="text"
                            value={formData.address || ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                            placeholder="Endereço completo"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                step="any"
                                value={formData.latitude ?? ''}
                                onChange={(e) => handleChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                                placeholder="Latitude: -3.4049"
                            />
                            <input
                                type="number"
                                step="any"
                                value={formData.longitude ?? ''}
                                onChange={(e) => handleChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-white focus:border-carnival-500 focus:ring-2 focus:ring-carnival-100 outline-none transition-all text-sm"
                                placeholder="Longitude: -39.0114"
                            />
                        </div>
                    </div>

                    {/* Flags */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 hover:border-carnival-300 transition-colors cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={formData.is_partner || false}
                                onChange={(e) => handleChange('is_partner', e.target.checked)}
                                className="w-4 h-4 text-carnival-600 rounded border-surface-300 focus:ring-carnival-500"
                            />
                            <ShieldCheck size={16} className="text-carnival-500" />
                            <div>
                                <p className="text-sm font-semibold text-surface-700">Parceiro</p>
                                <p className="text-[10px] text-surface-400">Verificado pelo Guia</p>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 hover:border-amber-300 transition-colors cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={formData.is_featured || false}
                                onChange={(e) => handleChange('is_featured', e.target.checked)}
                                className="w-4 h-4 text-amber-500 rounded border-surface-300 focus:ring-amber-500"
                            />
                            <Star size={16} className="text-amber-500" />
                            <div>
                                <p className="text-sm font-semibold text-surface-700">Destaque</p>
                                <p className="text-[10px] text-surface-400">Exibir no topo</p>
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
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-carnival-500 hover:bg-carnival-600 active:bg-carnival-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {(loading || uploading) ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            {loading ? 'Salvando...' : 'Salvar Estabelecimento'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
