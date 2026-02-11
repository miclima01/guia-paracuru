'use client';

import { useState } from 'react';
import { useCrud } from '@/hooks/useCrud';
import CrudTable from '@/components/admin/CrudTable';
import EmergencyContactModal from '@/components/admin/EmergencyContactModal';
import type { EmergencyContact } from '@/types';

export default function EmergencyContactsTable() {
    const { items, loading, createItem, updateItem, deleteItem } = useCrud<EmergencyContact>({
        table: 'emergency_contacts',
        orderBy: { column: 'order_index', ascending: true },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EmergencyContact | undefined>(undefined);

    const columns = [
        { key: 'name' as const, label: 'Nome' },
        { key: 'phone' as const, label: 'Telefone' },
        { key: 'category' as const, label: 'Categoria' },
        { key: 'icon' as const, label: 'Ícone' },
        { key: 'order_index' as const, label: 'Ordem' },
    ];

    async function handleSave(data: Partial<EmergencyContact>) {
        if (editingItem) {
            await updateItem(editingItem.id, data);
        } else {
            await createItem(data);
        }
        setIsModalOpen(false);
    }

    return (
        <>
            <CrudTable
                title="Contatos de Emergência"
                items={items}
                columns={columns}
                loading={loading}
                onAdd={() => {
                    setEditingItem(undefined);
                    setIsModalOpen(true);
                }}
                onEdit={(item) => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                }}
                onDelete={deleteItem}
            />

            <EmergencyContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingItem}
            />
        </>
    );
}
