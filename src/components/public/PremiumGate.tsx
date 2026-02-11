'use client';

import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { useAppStore } from '@/hooks/useStore';

interface PremiumGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PremiumGate({ children, fallback }: PremiumGateProps) {
  const { isPremium, openPaymentModal } = useAppStore();

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none opacity-40">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={openPaymentModal}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl carnival-gradient text-white font-bold shadow-lg shadow-fire-200/40 hover:shadow-fire-200/60 active:scale-95 transition-all"
        >
          <Sparkles size={18} />
          Desbloquear Premium
        </button>
      </div>
    </div>
  );
}
