'use client';

import { useCrud } from '@/hooks/useCrud';
import CrudTable from '@/components/admin/CrudTable';
import type { EmergencyContact } from '@/types';

export default function EmergencyContactsTable() {
    const { items, loading, deleteItem } = useCrud<EmergencyContact>({
        table: 'emergency_contacts',
        orderBy: { column: 'order_index', ascending: true },
    });

    const columns = [
        { key: 'name' as const, label: 'Nome' },
        { key: 'phone' as const, label: 'Telefone' },
        { key: 'category' as const, label: 'Categoria' },
        { key: 'icon' as const, label: 'Ícone' },
        { key: 'order_index' as const, label: 'Ordem' },
    ];

    return (
        <CrudTable
            title="Contatos de Emergência"
            items={items}
            columns={columns}
            loading={loading}
            onAdd={() => alert('Funcionalidade de adicionar será implementada')}
            onEdit={() => alert('Funcionalidade de editar será implementada')}
            onDelete={deleteItem}
        />
    );
}
