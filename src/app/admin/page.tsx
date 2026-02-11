'use client';

import { useEffect, useState } from 'react';
import { Calendar, Newspaper, Store, Users, DollarSign } from 'lucide-react';
import { getDashboardStats } from '@/actions/admin-actions';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    attractions: 0,
    news: 0,
    businesses: 0,
    payments: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  const cards = [
    { label: 'Atrações', value: stats.attractions, icon: Calendar, color: 'from-fire-500 to-carnival-500' },
    { label: 'Notícias', value: stats.news, icon: Newspaper, color: 'from-violet-500 to-purple-600' },
    { label: 'Estabelecimentos', value: stats.businesses, icon: Store, color: 'from-ocean-500 to-ocean-600' },
    { label: 'Pagamentos', value: stats.payments, icon: DollarSign, color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="font-display text-2xl text-surface-900">Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">
          Visão geral do sistema
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="group bg-white rounded-2xl shadow-sm border border-surface-200 p-6 hover:shadow-md transition-all duration-300 hover:border-surface-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                  </div>
                </div>
                <p className="text-3xl font-display text-surface-900 tracking-tight">{card.value}</p>
                <p className="text-sm font-medium text-surface-500 mt-1">{card.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 admin-card">
          <h2 className="font-display text-lg text-surface-900 mb-4">
            Bem-vindo ao Painel Administrativo
          </h2>
          <p className="text-surface-600">
            Utilize o menu lateral para gerenciar o conteúdo do Guia Paracuru.
          </p>
        </div>
      </div>
    </div>
  );
}
