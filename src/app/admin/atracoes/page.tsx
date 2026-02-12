'use client';

import { useState } from 'react';
import { useCrud } from '@/hooks/useCrud';
import CrudTable from '@/components/admin/CrudTable';
import AttractionAdminModal from '@/components/admin/AttractionAdminModal';
import type { Attraction } from '@/types';

export default function AtracoesAdminPage() {
  const { items, loading, createItem, updateItem, deleteItem } = useCrud<Attraction>({
    table: 'attractions',
    orderBy: { column: 'date', ascending: true },
  });

  const [editingItem, setEditingItem] = useState<Attraction | null>(null);
  const [showModal, setShowModal] = useState(false);

  const columns = [
    { key: 'name' as const, label: 'Atração' },
    {
      key: 'date' as const,
      label: 'Data',
      render: (value: string) => new Date(value + 'T00:00:00').toLocaleDateString('pt-BR'),
    },
    {
      key: 'start_time' as const,
      label: 'Horário',
      render: (value: string) => value?.substring(0, 5) || '-',
    },
    { key: 'location' as const, label: 'Local' },
  ];

  function handleAdd() {
    setEditingItem(null);
    setShowModal(true);
  }

  function handleEdit(item: Attraction) {
    setEditingItem(item);
    setShowModal(true);
  }

  async function handleSave(data: Partial<Attraction>) {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await createItem(data);
    }
  }

  return (
    <>
      <CrudTable
        title="Atrações"
        items={items}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={deleteItem}
      />

      <AttractionAdminModal
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
