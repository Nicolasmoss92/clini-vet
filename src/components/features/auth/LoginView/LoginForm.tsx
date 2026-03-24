'use client';

import { useAuth } from '@/contexts/AuthContext';
import { maskTelefone } from '@/lib/masks';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const ativado = searchParams?.get('ativado') === '1';

  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(telefone, password);
      router.push(user.role === 'ADMIN' ? '/dashboard' : '/minha-area');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bem-vindo de volta</h1>
        <p className="text-gray-500 text-sm mt-1">Acesse sua conta para continuar</p>
      </div>

      {ativado && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Conta ativada com sucesso! Faça login para continuar.
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Telefone</label>
          <input
            type="tel"
            required
            value={telefone}
            onChange={(e) => setTelefone(maskTelefone(e.target.value))}
            placeholder="(54) 99999-9999"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg border border-green-600 hover:bg-green-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <Link
        href="/primeiro-acesso"
        className="w-full block text-sm font-medium text-center text-green-600 border border-green-600 py-2.5 rounded-lg hover:bg-green-600 hover:text-white transition duration-300"
      >
        Ativar minha conta
      </Link>

      <Link
        href="/home"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-green-600 border border-green-600 py-2.5 rounded-lg hover:bg-green-600 hover:text-white transition duration-300"
      >
        <ArrowLeft size={14} />
        Voltar ao site
      </Link>
    </div>
  );
}
