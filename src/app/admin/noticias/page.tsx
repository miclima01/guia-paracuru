'use client';

import { useState } from 'react';
import { useCrud } from '@/hooks/useCrud';
import CrudTable from '@/components/admin/CrudTable';
import NewsModal from '@/components/admin/NewsModal';
import { formatDateTime } from '@/lib/utils';
import type { NewsArticle } from '@/types';

export default function NoticiasAdminPage() {
  const { items, loading, createItem, updateItem, deleteItem } = useCrud<NewsArticle>({
    table: 'news',
    orderBy: { column: 'published_at', ascending: false },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsArticle | undefined>(undefined);

  function handleAdd() {
    setEditingItem(undefined);
    setIsModalOpen(true);
  }

  function handleEdit(item: NewsArticle) {
    setEditingItem(item);
    setIsModalOpen(true);
  }

  async function handleSave(data: Partial<NewsArticle>) {
    if (editingItem) {
      await updateItem(editingItem.id, data);
    } else {
      await createItem(data as NewsArticle);
    }
    setIsModalOpen(false);
  }

  const columns = [
    { key: 'title' as const, label: 'Título' },
    { key: 'category' as const, label: 'Categoria' },
    {
      key: 'published_at' as const,
      label: 'Publicado em',
      render: (value: string) => formatDateTime(value),
    },
    {
      key: 'is_featured' as const,
      label: 'Destaque',
      render: (value: boolean) => (value ? '⭐' : '-'),
    },
  ];

  return (
    <div className="relative">
      <CrudTable
        title="Notícias"
        items={items}
        columns={columns}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={deleteItem}
      />

      <NewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
}
