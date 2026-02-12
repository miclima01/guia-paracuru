
'use client';

import { Suggestion } from '@/types';
import { formatDate } from '@/lib/utils';
import { Trash2, Mail, MailOpen, Search } from 'lucide-react';
import { useState } from 'react';

interface SuggestionsTableProps {
    suggestions: Suggestion[];
    loading: boolean;
    onUpdate: (id: string, data: Partial<Suggestion>) => Promise<boolean>;
    onDelete: (id: string) => Promise<boolean>;
}

export function SuggestionsTable({ suggestions, loading, onUpdate, onDelete }: SuggestionsTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta sugestão?')) return;

        setActionLoading(id);
        await onDelete(id);
        setActionLoading(null);
    };

    const toggleStatus = async (suggestion: Suggestion) => {
        const newStatus = suggestion.status === 'unread' ? 'read' : 'unread';
        setActionLoading(suggestion.id);
        await onUpdate(suggestion.id, { status: newStatus });
        setActionLoading(null);
    };

    const filteredSuggestions = suggestions.filter(suggestion =>
        suggestion.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (suggestion.name && suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-surface-200 bg-surface-50/50">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar nas sugestões..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-carnival-500/20 focus:border-carnival-500 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                {loading && suggestions.length === 0 ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="w-8 h-8 border-4 border-carnival-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : filteredSuggestions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-surface-400">Nenhuma sugestão encontrada</p>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">De</th>
                                <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Mensagem</th>
                                <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100">
                            {filteredSuggestions.map((suggestion) => (
                                <tr key={suggestion.id} className="hover:bg-surface-50/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${suggestion.status === 'unread'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : 'bg-surface-100 text-surface-600 border-surface-200'
                                                }`}
                                        >
                                            {suggestion.status === 'unread' ? 'Novo' : 'Lido'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 font-medium">
                                        {suggestion.name || <span className="text-surface-400 italic">Anônimo</span>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-surface-600 max-w-md truncate" title={suggestion.message}>
                                        {suggestion.message}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600">
                                        {formatDate(suggestion.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => toggleStatus(suggestion)}
                                                disabled={actionLoading === suggestion.id}
                                                className={`p-2 rounded-lg transition-colors ${suggestion.status === 'unread'
                                                        ? 'hover:bg-blue-50 text-surface-400 hover:text-blue-600'
                                                        : 'hover:bg-surface-100 text-surface-400 hover:text-surface-600'
                                                    }`}
                                                title={suggestion.status === 'unread' ? 'Marcar como lido' : 'Marcar como não lido'}
                                            >
                                                {suggestion.status === 'unread' ? <MailOpen size={18} /> : <Mail size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(suggestion.id)}
                                                disabled={actionLoading === suggestion.id}
                                                className="p-2 rounded-lg hover:bg-red-50 text-surface-400 hover:text-red-600 transition-colors"
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
                )}
            </div>

            {/* Mobile View (Alternative to table) */}
            <div className="md:hidden divide-y divide-surface-100 border-t border-surface-100">
                {filteredSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${suggestion.status === 'unread'
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'bg-surface-100 text-surface-600'
                                        }`}
                                >
                                    {suggestion.status === 'unread' ? 'Novo' : 'Lido'}
                                </span>
                                <h4 className="font-semibold text-surface-900 mt-1">
                                    {suggestion.name || 'Anônimo'}
                                </h4>
                            </div>
                            <span className="text-xs text-surface-400">
                                {formatDate(suggestion.created_at)}
                            </span>
                        </div>

                        <p className="text-sm text-surface-600 bg-surface-50 p-3 rounded-lg border border-surface-100">
                            {suggestion.message}
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => toggleStatus(suggestion)}
                                disabled={actionLoading === suggestion.id}
                                className="p-2 rounded-lg bg-surface-50 text-surface-600 border border-surface-200"
                            >
                                {suggestion.status === 'unread' ? <MailOpen size={16} /> : <Mail size={16} />}
                            </button>
                            <button
                                onClick={() => handleDelete(suggestion.id)}
                                disabled={actionLoading === suggestion.id}
                                className="p-2 rounded-lg bg-surface-50 text-red-600 border border-surface-200"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
