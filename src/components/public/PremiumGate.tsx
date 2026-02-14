'use client';

import { ReactNode } from 'react';

interface PremiumGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PremiumGate({ children }: PremiumGateProps) {
  return <>{children}</>;
}
