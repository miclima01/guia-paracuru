import { useState, useEffect, useCallback } from 'react';
import { getAdminItems, createAdminItem, updateAdminItem, deleteAdminItem } from '@/actions/admin-actions';
import toast from 'react-hot-toast';

interface UseCrudOptions<T> {
  table: string;
  orderBy?: { column: string; ascending?: boolean };
  filter?: { column: string; value: any };
}

export function useCrud<T extends { id: string }>(options: UseCrudOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAdminItems(options.table, {
        orderBy: options.orderBy,
        filter: options.filter,
      });
      setItems((data as T[]) || []);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Erro ao carregar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [options.table, JSON.stringify(options.orderBy), JSON.stringify(options.filter)]);

  // Create item
  const createItem = useCallback(
    async (data: Partial<T>): Promise<T | null> => {
      try {
        const newItem = await createAdminItem(options.table, data);
        setItems((prev) => [...prev, newItem as T]);
        toast.success('Item criado com sucesso!');
        return newItem as T;
      } catch (err: any) {
        toast.error(`Erro ao criar: ${err.message}`);
        return null;
      }
    },
    [options.table]
  );

  // Update item
  const updateItem = useCallback(
    async (id: string, data: Partial<T>): Promise<boolean> => {
      try {
        await updateAdminItem(options.table, id, data);
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, ...data } : item
          )
        );
        toast.success('Item atualizado com sucesso!');
        return true;
      } catch (err: any) {
        toast.error(`Erro ao atualizar: ${err.message}`);
        return false;
      }
    },
    [options.table]
  );

  // Delete item
  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await deleteAdminItem(options.table, id);
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast.success('Item excluído com sucesso!');
        return true;
      } catch (err: any) {
        toast.error(`Erro ao excluir: ${err.message}`);
        return false;
      }
    },
    [options.table]
  );

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refresh: fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
}
