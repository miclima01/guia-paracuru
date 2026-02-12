'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Newspaper,
  Store,
  Briefcase,
  Phone,
  Car,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/atracoes', icon: Calendar, label: 'Atrações' },
  { href: '/admin/noticias', icon: Newspaper, label: 'Notícias' },
  { href: '/admin/estabelecimentos', icon: Store, label: 'Estabelecimentos' },
  { href: '/admin/servicos', icon: Briefcase, label: 'Serviços' },
  { href: '/admin/contatos', icon: Phone, label: 'Contatos' },
  { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

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
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-surface-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <h1 className="font-display text-lg text-surface-900">Guia Paracuru</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-surface-600 hover:bg-surface-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-surface-200 overflow-y-auto z-10">
        <div className="p-6">
          <h1 className="font-display text-xl text-surface-900">
            Guia Paracuru
          </h1>
          <p className="text-xs text-surface-500 mt-1">Painel Admin</p>
        </div>

        <nav className="px-3 pb-6">
          <NavContent pathname={pathname} onNavigate={() => { }} />
        </nav>
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl flex flex-col">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h1 className="font-display text-xl text-surface-900">
                  Guia Paracuru
                </h1>
                <p className="text-xs text-surface-500 mt-1">Painel Admin</p>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-surface-400 hover:text-surface-600"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="px-3 pb-6 flex-1 overflow-y-auto">
              <NavContent pathname={pathname} onNavigate={() => setIsMobileMenuOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="md:ml-64 md:p-8">
        {children}
      </main>
    </div>
  );
}

function NavContent({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logout realizado');
      router.push('/admin/login');
    } catch {
      toast.error('Erro ao fazer logout');
    }
  }

  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
    </>
  );
}
