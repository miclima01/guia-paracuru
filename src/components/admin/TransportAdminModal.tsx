'use client';

import { useState, useEffect } from 'react';
import { X, Save, Car, Bike, User, Phone, Hash, Loader2 } from 'lucide-react';
import type { TransportContact } from '@/types';
import toast from 'react-hot-toast';

interface TransportAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<TransportContact>) => Promise<void>;
    initialData?: TransportContact;
}

export default function TransportAdminModal({ isOpen, onClose, onSave, initialData }: TransportAdminModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<TransportContact>>({
        name: '',
        phone: '',
        category: 'taxi',
        is_premium: false,
        order_index: 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                phone: '',
                category: 'taxi',
                is_premium: false,
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

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving transport contact:', error);
            toast.error('Erro ao salvar contato');
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (field: keyof TransportContact, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-surface-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                    <div>
                        <h2 className="text-lg font-bold text-surface-900">
                            {initialData ? 'Editar Transporte' : 'Novo Transporte'}
                        </h2>
                        <p className="text-xs text-surface-400 mt-0.5">Táxi, mototáxi ou privado</p>
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
                            <User size={12} /> Nome / Apelido *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                            placeholder="Ex: Taxista João"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-1.5">
                            <Phone size={12} /> Telefone / WhatsApp *
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                            placeholder="(85) 90000-0000"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-surface-500 uppercase tracking-wide mb-2">
                            <Car size={12} /> Tipo de Transporte
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleChange('category', 'taxi')}
                                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.category === 'taxi'
                                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                                    : 'border-surface-100 hover:border-surface-200 text-surface-500 hover:bg-surface-50'
                                    }`}
                            >
                                <Car size={24} className={formData.category === 'taxi' ? 'text-amber-600' : 'text-surface-400'} />
                                <span className="text-sm font-bold">Táxi</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleChange('category', 'mototaxi')}
                                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.category === 'mototaxi'
                                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                                    : 'border-surface-100 hover:border-surface-200 text-surface-500 hover:bg-surface-50'
                                    }`}
                            >
                                <Bike size={24} className={formData.category === 'mototaxi' ? 'text-amber-600' : 'text-surface-400'} />
                                <span className="text-sm font-bold">Mototáxi</span>
                            </button>
                        </div>
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
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all text-sm"
                        />
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
                            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
