'use client';

import { useState } from 'react';

import { useCrud } from '@/hooks/useCrud';
import CrudTable from '@/components/admin/CrudTable';
import EstablishmentModal from '@/components/admin/EstablishmentModal';
import { CATEGORY_LABELS } from '@/lib/utils';
import type { Business } from '@/types';

export default function EstabelecimentosAdminPage() {
  const { items, loading, deleteItem, createItem, updateItem } = useCrud<Business>({
    table: 'businesses',
    orderBy: { column: 'name', ascending: true },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Business | undefined>(undefined);

  async function handleSave(data: Partial<Business>) {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await createItem(data as Omit<Business, 'id' | 'created_at' | 'updated_at'>);
    }
    setIsModalOpen(false);
    setEditingItem(undefined);
  }

  const columns = [
    { key: 'name' as const, label: 'Nome' },
    {
      key: 'category' as const,
      label: 'Categoria',
      render: (value: string) => CATEGORY_LABELS[value as keyof typeof CATEGORY_LABELS] || value,
    },
    { key: 'phone' as const, label: 'Telefone' },
    {
      key: 'is_featured' as const,
      label: 'Destaque',
      render: (value: boolean) => (value ? '⭐' : '-'),
    },
    {
      key: 'is_partner' as const,
      label: 'Parceiro',
      render: (value: boolean) => (value ? '✅' : '-'),
    },
  ];

  return (
    <>
      <CrudTable
        title="Estabelecimentos"
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

      <EstablishmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(undefined);
        }}
        onSave={handleSave}
        initialData={editingItem}
      />
    </>
  );
}
