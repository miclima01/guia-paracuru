'use client';

import { useState, useEffect } from 'react';
import { X, Save, Phone, User, Tag, Shield, Hash, Loader2 } from 'lucide-react';
import type { EmergencyContact } from '@/types';
import toast from 'react-hot-toast';

interface EmergencyContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<EmergencyContact>) => Promise<void>;
    initialData?: EmergencyContact;
}

export default function EmergencyContactModal({ isOpen, onClose, onSave, initialData }: EmergencyContactModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<EmergencyContact>>({
        name: '',
        phone: '',
        category: '',
        icon: '',
        order_index: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                phone: '',
                category: '',
                icon: '',
                order_index: 0,
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.name?.trim()) {
            toast.error('Nome é obrigatório');
            return;
        }

        if (!formData.phone?.trim()) {
            toast.error('Telefone é obrigatório');
            return;
        }

        if (!formData.category?.trim()) {
            toast.error('Categoria é obrigatória');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving emergency contact:', error);
            toast.error('Erro ao salvar contato');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (field: keyof EmergencyContact, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-surface-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-bold text-surface-900">
                            {initialData ? 'Editar Contato' : 'Novo Contato'}
                        </h2>
                        <p className="text-xs text-surface-400 mt-0.5">Emergência e serviços essenciais</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    {/* Name */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <User size={12} /> Nome / Serviço *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
                            placeholder="Ex: Hospital Municipal"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <Phone size={12} /> Telefone *
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
                            placeholder="Ex: 190 ou (85) 3344-0000"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <Tag size={12} /> Categoria *
                        </label>
                        <select
                            required
                            value={formData.category || ''}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm appearance-none bg-white"
                        >
                            <option value="">Selecione uma categoria</option>
                            <option value="hospital">Hospital / Saúde</option>
                            <option value="police">Polícia / Segurança</option>
                            <option value="fire">Bombeiros / Defesa Civil</option>
                            <option value="other">Outros Serviços</option>
                        </select>
                    </div>

                    {/* Icon & Order Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Icon */}
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <Shield size={12} /> Ícone Lucide
                            </label>
                            <input
                                type="text"
                                value={formData.icon || ''}
                                onChange={(e) => handleChange('icon', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
                                placeholder="Ex: shield"
                            />
                        </div>

                        {/* Order Index */}
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                                <Hash size={12} /> Ordem
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.order_index || 0}
                                onChange={(e) => handleChange('order_index', parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none transition-all text-sm"
                            />
                        </div>
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
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
