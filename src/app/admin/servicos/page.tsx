'use client';

import { useState } from 'react';
import { useCrud } from '@/hooks/useCrud';
import CrudTable from '@/components/admin/CrudTable';
import ServiceModal from '@/components/admin/ServiceModal';
import { SERVICE_CATEGORY_LABELS } from '@/lib/utils';
import type { Service } from '@/types';

export default function ServicosAdminPage() {
  const { items, loading, deleteItem, createItem, updateItem } = useCrud<Service>({
    table: 'services',
    orderBy: { column: 'name', ascending: true },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | undefined>(undefined);

  async function handleSave(data: Partial<Service>) {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await createItem(data as Omit<Service, 'id' | 'created_at' | 'updated_at'>);
    }
    setIsModalOpen(false);
    setEditingItem(undefined);
  }

  const columns = [
    { key: 'name' as const, label: 'Nome' },
    {
      key: 'category' as const,
      label: 'Categoria',
      render: (value: string) => SERVICE_CATEGORY_LABELS[value as keyof typeof SERVICE_CATEGORY_LABELS] || value,
    },
    { key: 'whatsapp' as const, label: 'WhatsApp' },
    {
      key: 'is_featured' as const,
      label: 'Destaque',
      render: (value: boolean) => (value ? '⭐' : '-'),
    },
  ];

  return (
    <>
      <CrudTable
        title="Serviços"
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

      <ServiceModal
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
