'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Newspaper,
  Store,
  Phone,
  Car,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/atracoes', icon: Calendar, label: 'Atrações' },
  { href: '/admin/noticias', icon: Newspaper, label: 'Notícias' },
  { href: '/admin/estabelecimentos', icon: Store, label: 'Estabelecimentos' },
  { href: '/admin/contatos', icon: Phone, label: 'Contatos' },
  { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 10000)
    );

    try {
      const res = await Promise.race([
        fetch('/api/auth/check'),
        timeoutPromise
      ]) as Response;

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        console.error('Check auth failed', res.status);
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Check auth error', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logout realizado');
      router.push('/admin/login');
    } catch {
      toast.error('Erro ao fazer logout');
    }
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-fire-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-surface-200 overflow-y-auto">
        <div className="p-6">
          <h1 className="font-display text-xl text-surface-900">
            Guia Paracuru
          </h1>
          <p className="text-xs text-surface-500 mt-1">Painel Admin</p>
        </div>

        <nav className="px-3 pb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all',
                  isActive
                    ? 'carnival-gradient text-white shadow-md'
                    : 'text-surface-600 hover:bg-surface-50'
                )}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mt-4 text-fire-600 hover:bg-fire-50 transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sair</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64">
        {children}
      </main>
    </div>
  );
}
