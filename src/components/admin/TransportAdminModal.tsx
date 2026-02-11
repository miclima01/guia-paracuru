'use client';

import { useState, useEffect } from 'react';
import { X, Save, Car, Bike, Star } from 'lucide-react';
import type { TransportContact } from '@/types';

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
            alert('Nome é obrigatório');
            return;
        }

        if (!formData.phone?.trim()) {
            alert('Telefone é obrigatório');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving transport contact:', error);
            alert('Erro ao salvar contato');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-surface-100 bg-white">
                    <h2 className="text-xl font-bold text-surface-900">
                        {initialData ? 'Editar Transporte' : 'Novo Transporte'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-50 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Nome / Apelido *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            placeholder="Ex: Taxista João"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Telefone / WhatsApp *
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            placeholder="(85) 90000-0000"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-3">
                            Tipo de Transporte
                        </label>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, category: 'taxi' })}
                                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.category === 'taxi'
                                    ? 'border-carnival-500 bg-carnival-50 text-carnival-700'
                                    : 'border-surface-100 hover:border-surface-200 text-surface-500'
                                    }`}
                            >
                                <Car size={24} />
                                <span className="text-sm font-bold">Táxi</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, category: 'mototaxi' })}
                                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.category === 'mototaxi'
                                    ? 'border-carnival-500 bg-carnival-50 text-carnival-700'
                                    : 'border-surface-100 hover:border-surface-200 text-surface-500'
                                    }`}
                            >
                                <Bike size={24} />
                                <span className="text-sm font-bold">Mototáxi</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {/* Order Index */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-surface-700 mb-1">
                                Ordem
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.order_index || 0}
                                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-carnival-500 focus:ring-2 focus:ring-carnival-200 outline-none transition-all"
                            />
                        </div>

                        {/* Is Premium */}
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-surface-700 mb-2">
                                Premium?
                            </label>
                            <label className="flex items-center gap-2 p-2 rounded-lg border border-surface-200 hover:bg-surface-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_premium || false}
                                    onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                                    className="w-4 h-4 text-carnival-600 rounded border-surface-300 focus:ring-carnival-500"
                                />
                                <span className="text-sm text-surface-600 flex items-center gap-1">
                                    <Star size={14} className="text-amber-500" />
                                    Sim
                                </span>
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
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
