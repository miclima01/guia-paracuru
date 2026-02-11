'use client';

import { useState } from 'react';
import EmergencyContactsTable from '@/components/admin/EmergencyContactsTable';
import TransportContactsTable from '@/components/admin/TransportContactsTable';
import { Phone, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContatosAdminPage() {
  const [activeTab, setActiveTab] = useState<'emergency' | 'transport'>('emergency');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-surface-900">Gerenciar Contatos</h1>
      </div>

      <div className="flex items-center gap-1 border-b border-surface-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('emergency')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
            activeTab === 'emergency'
              ? "border-fire-500 text-fire-600 bg-fire-50/50"
              : "border-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50"
          )}
        >
          <Phone size={18} />
          Contatos de Emergência
        </button>
        <button
          onClick={() => setActiveTab('transport')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
            activeTab === 'transport'
              ? "border-ocean-500 text-ocean-600 bg-ocean-50/50"
              : "border-transparent text-surface-500 hover:text-surface-700 hover:bg-surface-50"
          )}
        >
          <Car size={18} />
          Táxi e Mototáxi
        </button>
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'emergency' ? (
          <EmergencyContactsTable />
        ) : (
          <TransportContactsTable />
        )}
      </div>
    </div>
  );
}
