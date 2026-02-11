'use client';

import { useState, useEffect } from 'react';
import { X, Save, Phone } from 'lucide-react';
import type { EmergencyContact } from '@/types';

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
            alert('Nome é obrigatório');
            return;
        }

        if (!formData.phone?.trim()) {
            alert('Telefone é obrigatório');
            return;
        }

        if (!formData.category?.trim()) {
            alert('Categoria é obrigatória');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving emergency contact:', error);
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
                        {initialData ? 'Editar Contato de Emergência' : 'Novo Contato de Emergência'}
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
                            Nome *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-fire-500 focus:ring-2 focus:ring-fire-200 outline-none transition-all"
                            placeholder="Ex: Hospital / Pronto Socorro"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Telefone *
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone || ''}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-fire-500 focus:ring-2 focus:ring-fire-200 outline-none transition-all"
                            placeholder="192"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Categoria *
                        </label>
                        <select
                            required
                            value={formData.category || ''}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-fire-500 focus:ring-2 focus:ring-fire-200 outline-none transition-all"
                        >
                            <option value="">Selecione uma categoria</option>
                            <option value="hospital">Hospital</option>
                            <option value="police">Polícia</option>
                            <option value="fire">Bombeiros</option>
                            <option value="other">Outro</option>
                        </select>
                    </div>

                    {/* Icon */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Ícone
                        </label>
                        <input
                            type="text"
                            value={formData.icon || ''}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-fire-500 focus:ring-2 focus:ring-fire-200 outline-none transition-all"
                            placeholder="Ex: shield, stethoscope, flame"
                        />
                        <p className="text-xs text-surface-500 mt-1">
                            Nome do ícone Lucide (opcional)
                        </p>
                    </div>

                    {/* Order Index */}
                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-1">
                            Ordem
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.order_index || 0}
                            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 rounded-lg border border-surface-200 focus:border-fire-500 focus:ring-2 focus:ring-fire-200 outline-none transition-all"
                        />
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
                            className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-fire-500 hover:bg-fire-600 active:bg-fire-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
