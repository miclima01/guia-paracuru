
'use client';

import { Suggestion } from '@/types';
import { SuggestionsTable } from '@/components/admin/SuggestionsTable';
import { MessageSquareText } from 'lucide-react';
import { useCrud } from '@/hooks/useCrud';

export default function SuggestionsPage() {
    const { items, loading, updateItem, deleteItem } = useCrud<Suggestion>({
        table: 'suggestions',
        orderBy: { column: 'created_at', ascending: false },
    });

    return (
        <div className="admin-container">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-2xl text-surface-900 flex items-center gap-2">
                        Sugestões <MessageSquareText className="text-carnival-500" />
                    </h1>
                    <p className="text-surface-500 text-sm mt-1">
                        Gerencie as sugestões enviadas pelos usuários
                    </p>
                </div>
            </div>

            <SuggestionsTable
                suggestions={items}
                loading={loading}
                onUpdate={updateItem}
                onDelete={deleteItem}
            />
        </div>
    );
}
