'use client';

import { authApi } from '@/lib/api';
import { maskTelefone } from '@/lib/masks';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function PrimeiroAcessoForm() {
  const router = useRouter();

  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    <div className="flex flex-col gap-5 w-full">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Ativar minha conta</h1>
        <p className="text-gray-500 text-sm mt-1">
          Use o telefone cadastrado pela clínica e crie sua senha.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Telefone cadastrado</label>
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
          <label className="text-sm font-medium text-gray-700">
            E-mail <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Crie sua senha</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Confirme sua senha</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repita a senha"
              className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg border border-green-600 hover:bg-green-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {loading ? 'Ativando...' : 'Ativar conta'}
        </button>
      </form>

      <Link
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-green-600 border border-green-600 py-2.5 rounded-lg hover:bg-green-600 hover:text-white transition duration-300"
      >
        <ArrowLeft size={14} />
        Já tenho conta
      </Link>
    </div>
  );
}
