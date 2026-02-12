'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAdvertisements, createAdvertisement, updateAdvertisement, deleteAdvertisement } from '@/actions/admin-actions';
import { Edit2, Trash2, Plus, Search, Eye, EyeOff } from 'lucide-react';
import AdvertisementAdminModal from '@/components/admin/AdvertisementAdminModal';
import type { Advertisement } from '@/types/advertisement';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
    const [items, setItems] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState<Advertisement | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAdvertisements();
            setItems((data as Advertisement[]) || []);
        } catch (err) {
            toast.error(`Erro ao carregar anúncios: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const filteredItems = items.filter((item) => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return (
            item.title.toLowerCase().includes(s) ||
            (item.subtitle || '').toLowerCase().includes(s)
        );
    });

    function handleAdd() {
        setEditingItem(null);
        setShowModal(true);
    }

    function handleEdit(item: Advertisement) {
        setEditingItem(item);
        setShowModal(true);
    }

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja excluir este anúncio?')) return;
        try {
            await deleteAdvertisement(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
            toast.success('Anúncio excluído!');
        } catch (err) {
            toast.error(`Erro ao excluir: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    }

    async function handleSave(data: Partial<Advertisement>) {
        if (editingItem) {
            await updateAdvertisement(editingItem.id, data);
            setItems((prev) =>
                prev.map((item) =>
                    item.id === editingItem.id ? { ...item, ...data } as Advertisement : item
                )
            );
            toast.success('Anúncio atualizado!');
        } else {
            const newItem = await createAdvertisement(data);
            setItems((prev) => [...prev, newItem as Advertisement]);
            toast.success('Anúncio criado!');
        }
    }

    async function handleToggleActive(item: Advertisement) {
        try {
            await updateAdvertisement(item.id, { active: !item.active });
            setItems((prev) =>
                prev.map((i) =>
                    i.id === item.id ? { ...i, active: !i.active } : i
                )
            );
            toast.success(item.active ? 'Anúncio desativado' : 'Anúncio ativado');
        } catch (err) {
            toast.error(`Erro: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        }
    }

    return (
        <>
            <div className="admin-container">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="font-display text-2xl text-surface-900">Publicidade</h1>
                        <p className="text-surface-500 text-sm mt-1">
                            Gerencie os banners do carrossel publicitário
                        </p>
                    </div>
                    <button onClick={handleAdd} className="btn-primary flex items-center justify-center gap-2">
                        <Plus size={18} />
                        Adicionar
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-surface-200 bg-surface-50/50">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar anúncios..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-carnival-500/20 focus:border-carnival-500 transition-all text-sm"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-surface-400">Nenhum anúncio encontrado</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-surface-50">
                                        <tr>
                                            <th className="text-left py-3 px-6 text-xs font-bold text-surface-500 uppercase tracking-wider">Imagem</th>
                                            <th className="text-left py-3 px-6 text-xs font-bold text-surface-500 uppercase tracking-wider">Título</th>
                                            <th className="text-left py-3 px-6 text-xs font-bold text-surface-500 uppercase tracking-wider">Subtítulo</th>
                                            <th className="text-left py-3 px-6 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                                            <th className="text-left py-3 px-6 text-xs font-bold text-surface-500 uppercase tracking-wider">Ordem</th>
                                            <th className="text-right py-3 px-6 text-xs font-bold text-surface-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-100">
                                        {filteredItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-surface-50/50 transition-colors">
                                                <td className="py-3 px-6">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-surface-200" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-surface-100 border border-surface-200" />
                                                    )}
                                                </td>
                                                <td className="py-3 px-6 text-sm font-medium text-surface-900">{item.title}</td>
                                                <td className="py-3 px-6 text-sm text-surface-500">{item.subtitle || '-'}</td>
                                                <td className="py-3 px-6">
                                                    <button
                                                        onClick={() => handleToggleActive(item)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${item.active
                                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                            : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                                                            }`}
                                                    >
                                                        {item.active ? <Eye size={12} /> : <EyeOff size={12} />}
                                                        {item.active ? 'Ativo' : 'Inativo'}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-6 text-sm text-surface-500">{item.order_index}</td>
                                                <td className="py-3 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="p-2 rounded-lg hover:bg-ocean-50 text-surface-400 hover:text-ocean-600 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 rounded-lg hover:bg-fire-50 text-surface-400 hover:text-fire-600 transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden divide-y divide-surface-100">
                                {filteredItems.map((item) => (
                                    <div key={item.id} className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-surface-200 flex-shrink-0" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-surface-100 border border-surface-200 flex-shrink-0" />
                                                )}
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-surface-900 truncate">{item.title}</p>
                                                    <p className="text-xs text-surface-500 truncate">{item.subtitle || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 rounded-lg bg-surface-50 text-ocean-600 border border-surface-200"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-lg bg-surface-50 text-fire-600 border border-surface-200"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleToggleActive(item)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${item.active
                                                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                                    : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                                                    }`}
                                            >
                                                {item.active ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {item.active ? 'Ativo' : 'Inativo'}
                                            </button>
                                            <span className="text-xs text-surface-400">Ordem: {item.order_index}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <AdvertisementAdminModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingItem(null);
                }}
                onSave={handleSave}
                initialData={editingItem || undefined}
            />
        </>
    );
}
