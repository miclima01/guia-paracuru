'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/hooks/useStore';
import { supabase } from '@/lib/supabase';
import BottomNav from '@/components/public/BottomNav';
import { SuggestionButton } from '@/components/public/SuggestionButton';
import PaymentModal from '@/components/payment/PaymentModal';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkPremium, isPaymentModalOpen } = useAppStore();
  const [supportWhatsapp, setSupportWhatsapp] = useState('');

  useEffect(() => {
    checkPremium();
    supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'support_whatsapp')
      .single()
      .then(({ data }) => {
        if (data?.value) setSupportWhatsapp(data.value);
      });
  }, [checkPremium]);

  return (
    <div className="min-h-screen pb-20">
      {children}

      {/* Suggestion Button */}
      <SuggestionButton />


      <BottomNav />
      {isPaymentModalOpen && <PaymentModal />}
    </div>
  );
}
