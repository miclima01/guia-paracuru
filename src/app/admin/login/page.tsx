'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast.success('Login realizado!');
        router.push('/admin');
      } else {
        toast.error('Senha incorreta');
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl carnival-gradient mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="font-display text-2xl text-surface-900">
            Painel Administrativo
          </h1>
          <p className="text-surface-500 text-sm mt-2">
            Guia Paracuru - Carnaval 2026
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-surface-700 mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              className="input"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-primary w-full flex items-center justify-center gap-2"
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
        </form>
      </div>
    </div>
  );
}
