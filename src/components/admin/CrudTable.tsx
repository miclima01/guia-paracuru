'use client';

import { Edit2, Trash2, Plus } from 'lucide-react';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface CrudTableProps<T extends { id: string }> {
  title: string;
  items: T[];
  columns: Column<T>[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
}

export default function CrudTable<T extends { id: string }>({
  title,
  items,
  columns,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: CrudTableProps<T>) {
  return (
    <div className="admin-container">
      <div className="admin-header flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-surface-900">{title}</h1>
          <p className="text-surface-500 text-sm mt-1">
            Gerencie os registros de {title.toLowerCase()}
          </p>
        </div>
        <button onClick={onAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Adicionar
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 admin-card">
            <p className="text-surface-400">Nenhum registro encontrado</p>
          </div>
        ) : (
          <div className="admin-card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200">
                  {columns.map((col) => (
                    <th
                      key={col.key as string}
                      className="text-left py-3 px-4 text-sm font-semibold text-surface-700"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="text-right py-3 px-4 text-sm font-semibold text-surface-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-surface-100 hover:bg-surface-50">
                    {columns.map((col) => (
                      <td key={col.key as string} className="py-3 px-4 text-sm text-surface-600">
                        {col.render
                          ? col.render(item[col.key], item)
                          : String(item[col.key] || '-')}
                      </td>
                    ))}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-lg hover:bg-ocean-50 text-ocean-600 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir?')) {
                              onDelete(item.id);
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-fire-50 text-fire-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
