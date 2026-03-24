'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { maskTelefone } from '@/lib/masks';
import Link from 'next/link';
import { PageTransition } from '@/components/ui/PageTransition';

export function PrimeiroAcessoView() {
  const router = useRouter();

  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await authApi.register({ telefone, password, email: email || undefined });
      router.push('/login?ativado=1');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao ativar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-white h-20 flex items-center px-6 shadow-md">
        <Link href="/home">
          <img src="/logo.png" alt="CliniVet" className="h-14 object-contain" />
        </Link>
      </div>

      <main className="flex-grow flex items-center justify-center p-4">
        <PageTransition>
        <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-100 border-t-4 border-t-green-600 p-8">
          <h1 className="text-2xl font-bold text-green-600 mb-2 text-center">Primeiro Acesso</h1>
          <p className="text-gray-500 text-sm text-center mb-6">
            Use o telefone cadastrado pela clínica e crie sua senha.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone cadastrado</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Crie sua senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirme sua senha</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg border border-green-600 transition duration-300 hover:bg-white hover:text-green-600 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Ativando...' : 'Ativar conta'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-green-600 hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
        </PageTransition>
      </main>
    </div>
  );
}
