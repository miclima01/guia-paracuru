'use client';

import { useEffect, useState } from 'react';
import { Phone, Shield, Store, Car, Ticket, MessageCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { EMERGENCY_ICONS, formatPhone } from '@/lib/utils';
import type { EmergencyContact, TransportContact } from '@/types';
import Link from 'next/link';
import PremiumGate from '@/components/public/PremiumGate';

export default function ContatosPage() {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [transportContacts, setTransportContacts] = useState<TransportContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransportType, setSelectedTransportType] = useState<'taxi' | 'mototaxi'>('taxi');
  const [supportWhatsapp, setSupportWhatsapp] = useState('');

  useEffect(() => {
    async function loadContacts() {
      try {
        const [emergencyRes, transportRes, whatsappRes] = await Promise.all([
          supabase.from('emergency_contacts').select('*').order('order_index'),
          supabase.from('transport_contacts').select('*').order('category').order('name'),
          supabase.from('app_settings').select('value').eq('key', 'support_whatsapp').single(),
        ]);

        if (emergencyRes.data) setEmergencyContacts(emergencyRes.data);
        if (transportRes.data) setTransportContacts(transportRes.data);
        if (whatsappRes.data?.value) setSupportWhatsapp(whatsappRes.data.value);
      } catch (error) {
        console.error('Error loading contacts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadContacts();
  }, []);

  const filteredTransport = transportContacts.filter(
    (t) => t.category === selectedTransportType
  );

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="px-0 sm:px-4 sm:pt-4 pb-2 max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-red-500 to-orange-600 noise sm:rounded-xl shadow-xl">
          <div className="px-5 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4 backdrop-blur-sm">
              <Phone size={24} className="text-white" />
            </div>
            <h1 className="font-display text-3xl mb-2 text-white">Contatos</h1>
            <p className="text-white/80">Emergência, táxi e mototáxi</p>
          </div>
        </div>
      </section>

      <PremiumGate>
        <div className="px-4 mt-8 max-w-2xl mx-auto space-y-8">
          {/* Emergency Section */}
          <section>
            <div className="mb-4 text-surface-900">
              <h2 className="font-display text-lg">Contatos de Emergência</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Hospital */}
              <a href="tel:192" className="flex flex-col p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all">
                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center mb-3 shadow-sm">
                  <Store size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-surface-900 leading-tight">Hospital / Pronto Socorro</p>
                  <p className="text-xs text-fire-600 font-bold mt-1 flex items-center gap-1">
                    <Phone size={10} /> 192
                  </p>
                </div>
              </a>

              {/* Police */}
              <a href="tel:190" className="flex flex-col p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.98] transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-3 shadow-sm">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-surface-900 leading-tight">RAIO / Polícia</p>
                  <p className="text-xs text-fire-600 font-bold mt-1 flex items-center gap-1">
                    <Phone size={10} /> 190
                  </p>
                </div>
              </a>

              {emergencyContacts.filter(c => c.name !== 'Hospital / Pronto Socorro' && c.name !== 'RAIO / Polícia').map((contact) => (
                <a
                  key={contact.id}
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white shadow-sm border border-surface-100 active:scale-[0.97] transition-all"
                >
                  <span className="text-xl">{EMERGENCY_ICONS[contact.category] || '📞'}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-surface-900 truncate">{contact.name}</p>
                    <p className="text-xs text-fire-600 font-semibold">{contact.phone}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Transport Section */}
          <section>
            <div className="mb-4 text-surface-900">
              <h2 className="font-display text-lg">Táxi & Mototáxi</h2>
            </div>

            {/* Transport type selector */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setSelectedTransportType('taxi')}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${selectedTransportType === 'taxi'
                  ? 'bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-md'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
              >
                Táxi
              </button>
              <button
                onClick={() => setSelectedTransportType('mototaxi')}
                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${selectedTransportType === 'mototaxi'
                  ? 'bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-md'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                  }`}
              >
                Mototáxi
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTransport.map(contact => {
                const cleanPhone = contact.phone.replace(/\D/g, '');
                const whatsappLink = `https://wa.me/55${cleanPhone}`;

                return (
                  <div
                    key={contact.id}
                    className="bg-white p-4 rounded-xl border border-surface-100 shadow-sm flex items-center justify-between transition-all hover:border-surface-200"
                  >
                    <div>
                      <p className="font-semibold text-base text-surface-900">{contact.name}</p>
                      <p className="text-sm text-ocean-600 font-semibold mt-0.5">{formatPhone(contact.phone)}</p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors shadow-sm active:scale-95"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle size={20} />
                      </a>
                      <a
                        href={`tel:${contact.phone}`}
                        className="w-10 h-10 rounded-full bg-ocean-50 flex items-center justify-center text-ocean-600 hover:bg-ocean-100 transition-colors shadow-sm active:scale-95"
                        aria-label="Ligar"
                      >
                        <Phone size={20} />
                      </a>
                    </div>
                  </div>
                );
              })}

              {filteredTransport.length === 0 && !loading && (
                <div className="col-span-full py-8 text-center text-surface-500 text-sm">
                  Nenhum contato encontrado.
                </div>
              )}
            </div>
          </section>

          {/* Commercial Opportunity Banner */}
          <a
            href={`https://wa.me/55${(supportWhatsapp || '85994293148').replace(/\D/g, '')}?text=Olá! Gostaria de anunciar no Guia do Carnaval.`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full relative overflow-hidden rounded-xl p-6 text-left shadow-lg active:scale-[0.98] transition-all group"
          >
            {/* Background - Green Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-500" />
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

            <div className="relative z-10">
              <h3 className="font-display text-lg font-semibold text-white mt-2">
                Quer seu número aqui?
              </h3>

              <p className="text-sm text-white/70 mt-1 mb-4 max-w-[90%]">
                Destaque seu serviço de transporte para milhares de foliões.
              </p>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-600 text-sm font-bold shadow-sm group-hover:bg-surface-50 transition-colors">
                Anunciar agora <ArrowRight size={14} />
              </span>
            </div>
          </a>
        </div>
      </PremiumGate>
    </div>
  );
}
