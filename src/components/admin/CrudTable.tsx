import { useState } from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  // Filter items based on search term
  const filteredItems = items.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();

    return columns.some((col) => {
      const value = item[col.key];
      return String(value).toLowerCase().includes(searchLower);
    });
  });

  return (
    <div className="admin-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-surface-900">{title}</h1>
          <p className="text-surface-500 text-sm mt-1">
            Gerencie os registros do sistema
          </p>
        </div>
        <button onClick={onAdd} className="btn-primary flex items-center justify-center gap-2">
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
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-carnival-500/20 focus:border-carnival-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-surface-400">Nenhum registro encontrado</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-50">
                    <tr>
                      {columns.map((col) => (
                        <th
                          key={col.key as string}
                          className="text-left py-3 px-6 text-xs font-bold text-surface-500 uppercase tracking-wider"
                        >
                          {col.label}
                        </th>
                      ))}
                      <th className="text-right py-3 px-6 text-xs font-bold text-surface-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-surface-50/50 transition-colors">
                        {columns.map((col) => (
                          <td key={col.key as string} className="py-4 px-6 text-sm text-surface-700 whitespace-nowrap">
                            {col.render
                              ? col.render(item[col.key], item)
                              : String(item[col.key] || '-')}
                          </td>
                        ))}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onEdit(item)}
                              className="p-2 rounded-lg hover:bg-ocean-50 text-surface-400 hover:text-ocean-600 transition-colors"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Tem certeza que deseja excluir?')) {
                                  onDelete(item.id);
                                }
                              }}
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
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        {columns.slice(0, 2).map((col) => (
                          <div key={col.key as string}>
                            <span className="text-xs font-medium text-surface-500 uppercase mr-2">
                              {col.label}:
                            </span>
                            <span className="text-sm font-semibold text-surface-900">
                              {col.render
                                ? col.render(item[col.key], item)
                                : String(item[col.key] || '-')}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 rounded-lg bg-surface-50 text-ocean-600 border border-surface-200"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Tem certeza que deseja excluir?')) {
                              onDelete(item.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-surface-50 text-fire-600 border border-surface-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {columns.length > 2 && (
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-100/50">
                        {columns.slice(2).map((col) => (
                          <div key={col.key as string}>
                            <p className="text-[10px] uppercase font-bold text-surface-400">{col.label}</p>
                            <p className="text-sm text-surface-700 truncate">
                              {col.render
                                ? col.render(item[col.key], item)
                                : String(item[col.key] || '-')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
