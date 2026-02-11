'use client';

import { useState } from 'react';
import { useCrud } from '@/hooks/useCrud';
import CrudTable from '@/components/admin/CrudTable';
import TransportAdminModal from '@/components/admin/TransportAdminModal';
import type { TransportContact } from '@/types';

export default function TransporteAdminPage() {
  const { items, loading, createItem, updateItem, deleteItem } = useCrud<TransportContact>({
    table: 'transport_contacts',
    orderBy: { column: 'category', ascending: true },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TransportContact | undefined>(undefined);

  const columns = [
    { key: 'name' as const, label: 'Nome' },
    { key: 'phone' as const, label: 'Telefone' },
    {
      key: 'category' as const,
      label: 'Tipo',
      render: (value: string) => (value === 'taxi' ? '🚕 Táxi' : '🏍️ Mototáxi'),
    },
    {
      key: 'is_premium' as const,
      label: 'Premium',
      render: (value: boolean) => (value ? '✨' : '-'),
    },
  ];

  async function handleSave(data: Partial<TransportContact>) {
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
        title="Transporte"
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

      <TransportAdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />
    </>
  );
}
