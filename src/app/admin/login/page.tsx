'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogIn, Mail, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login realizado!');
        router.push('/admin');
      } else {
        toast.error(data.error || 'Erro ao fazer login');
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-orange-50/30 to-surface-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl carnival-gradient mb-6 shadow-lg">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="font-display text-3xl text-surface-900 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-surface-500 text-sm">
            Guia Paracuru - Carnaval 2026
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-xl p-8 border border-surface-100">
          {/* Email Field */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-semibold text-surface-700 mb-2">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-surface-200 bg-white text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-fire-500 focus:ring-4 focus:ring-fire-500/10 transition-all"
                required
                autoFocus
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-surface-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-surface-200 bg-white text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-fire-500 focus:ring-4 focus:ring-fire-500/10 transition-all"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3.5 rounded-xl font-bold text-white carnival-gradient hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                Entrar
              </>
            )}
          </button>

          {/* Session Info */}
          <p className="text-center text-xs text-surface-400 mt-6">
            Sessão válida por 7 dias
          </p>
        </form>
      </div>
    </div>
  );
}
