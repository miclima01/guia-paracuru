'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, MapPin, Newspaper, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/programacao', icon: Calendar, label: 'Programação' },
  { href: '/mapa', icon: MapPin, label: 'Mapa' },
  { href: '/noticias', icon: Newspaper, label: 'Notícias' },
  { href: '/contatos', icon: Phone, label: 'Contatos' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-surface-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
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
