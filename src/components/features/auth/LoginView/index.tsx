'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { maskTelefone } from '@/lib/masks';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function LoginForm() {
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
    <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-100 border-t-4 border-t-green-600 p-8">
      <h1 className="text-2xl font-bold text-green-600 mb-2 text-center">Bem-vindo</h1>
      <p className="text-gray-500 text-sm text-center mb-6">Acesse sua conta para continuar</p>

      {ativado && (
        <div className="mb-4 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm text-center">
          Conta ativada com sucesso! Faça login para continuar.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
          <input
            type="tel"
            required
            value={telefone}
            onChange={(e) => setTelefone(maskTelefone(e.target.value))}
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg border border-green-600 transition duration-300 hover:bg-white hover:text-green-600 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-6">
        Primeiro acesso?{' '}
        <Link href="/primeiro-acesso" className="text-green-600 hover:underline">
          Ativar minha conta
        </Link>
      </p>
    </div>
  );
}

export function LoginView() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white h-20 flex items-center px-6 shadow-md">
        <Link href="/home">
          <img src="/logo.png" alt="CliniVet" className="h-14 object-contain" />
        </Link>
      </div>
      <main className="flex-grow flex items-center justify-center p-4">
        <Suspense fallback={<LoadingSpinner />}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
