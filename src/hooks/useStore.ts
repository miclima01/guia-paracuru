import { create } from 'zustand';
import { checkPremiumAccess } from '@/lib/premium';

interface AppState {
  // Premium state
  isPremium: boolean;
  setIsPremium: (isPremium: boolean) => void;
  checkPremium: () => void;

  // Payment modal
  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;

  // Admin state
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (isLoggedIn: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Premium
  isPremium: false,
  setIsPremium: (isPremium) => set({ isPremium }),
  checkPremium: () => set({ isPremium: checkPremiumAccess() }),

  // Payment modal
  isPaymentModalOpen: false,
  openPaymentModal: () => set({ isPaymentModalOpen: true }),
  closePaymentModal: () => set({ isPaymentModalOpen: false }),

  // Admin
  isAdminLoggedIn: false,
  setIsAdminLoggedIn: (isAdminLoggedIn) => set({ isAdminLoggedIn }),
}));
