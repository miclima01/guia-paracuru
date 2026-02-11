'use client';

import { useState } from 'react';
import EmergencyContactsTable from '@/components/admin/EmergencyContactsTable';
import TransportContactsTable from '@/components/admin/TransportContactsTable';
import { Phone, Car } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContatosAdminPage() {
  const [activeTab, setActiveTab] = useState<'emergency' | 'transport'>('emergency');

  return (
    <div className="space-y-6">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pt-6 md:pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-2xl text-surface-900">Gerenciar Contatos</h1>
        </div>

        <div className="bg-surface-100 p-1 rounded-xl inline-flex max-w-full overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('emergency')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap",
              activeTab === 'emergency'
                ? "bg-white text-fire-600 shadow-sm"
                : "text-surface-500 hover:text-surface-700 hover:bg-surface-200/50"
            )}
          >
            <Phone size={18} />
            Contatos de Emergência
          </button>
          <button
            onClick={() => setActiveTab('transport')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap",
              activeTab === 'transport'
                ? "bg-white text-ocean-600 shadow-sm"
                : "text-surface-500 hover:text-surface-700 hover:bg-surface-200/50"
            )}
          >
            <Car size={18} />
            Táxi e Mototáxi
          </button>
        </div>
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
