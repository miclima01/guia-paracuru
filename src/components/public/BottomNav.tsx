'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, MapPin, Newspaper, Phone, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/hooks/useStore';

const navItems = [
  { href: '/', icon: Home, label: 'Início', needsPremium: false },
  { href: '/programacao', icon: Calendar, label: 'Programação', needsPremium: true },
  { href: '/mapa', icon: MapPin, label: 'Mapa', needsPremium: true },
  { href: '/noticias', icon: Newspaper, label: 'Notícias', needsPremium: true },
  { href: '/contatos', icon: Phone, label: 'Contatos', needsPremium: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isPremium, openPaymentModal } = useAppStore();

  const handleNavigation = (href: string, needsPremium: boolean) => {
    if (needsPremium && !isPremium) {
      openPaymentModal();
    } else {
      router.push(href);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isLocked = item.needsPremium && !isPremium;

          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href, item.needsPremium)}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[60px] relative group',
                isActive
                  ? 'text-fire-600'
                  : 'text-surface-400 hover:text-surface-600 active:scale-95'
              )}
            >
              <div className="relative">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="shrink-0"
                />
                {isLocked && (
                  <div className="absolute -top-1 -right-1 bg-surface-100 rounded-full p-[1.5px] shadow-sm border border-surface-200">
                    <Lock size={8} className="text-surface-500" />
                  </div>
                )}
              </div>
              <span className={cn('text-[10px] font-medium', isActive && 'font-bold')}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
