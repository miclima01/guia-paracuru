'use client';

import BottomNav from '@/components/public/BottomNav';
import { SuggestionButton } from '@/components/public/SuggestionButton';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-20">
      {children}

      {/* Suggestion Button */}
      <SuggestionButton />

      <BottomNav />
    </div>
  );
}
