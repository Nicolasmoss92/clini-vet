'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function ButtonLogin() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push(user.role === 'ADMIN' ? '/dashboard' : '/minha-area')}
          className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300"
        >
          {user.role === 'ADMIN' ? 'Dashboard' : 'Minha Área'}
        </button>
        <button
          onClick={() => { logout(); router.push('/home'); }}
          className="text-sm font-medium text-gray-500 hover:text-green-600 transition duration-300"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 whitespace-nowrap"
    >
      Login / Área do Cliente
    </Link>
  );
}
