'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/hooks/useStore';
import BottomNav from '@/components/public/BottomNav';
import PaymentModal from '@/components/payment/PaymentModal';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkPremium, isPaymentModalOpen } = useAppStore();

  useEffect(() => {
    checkPremium();
  }, [checkPremium]);

  return (
    <div className="min-h-screen pb-20">
      {children}
      <BottomNav />
      {isPaymentModalOpen && <PaymentModal />}
    </div>
  );
}
