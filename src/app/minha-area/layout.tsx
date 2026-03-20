'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const navItems = [
  { label: 'Meus Pets', href: '/minha-area' },
  { label: 'Agendamentos', href: '/minha-area/agendamentos' },
];

export default function MinhaAreaLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user?.role === 'ADMIN') router.replace('/dashboard');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="bg-green-600 h-16 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="CliniVet" className="h-10 object-contain brightness-0 invert" />
          <span className="text-white font-semibold text-sm hidden sm:block">Área do Cliente</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-100 text-sm hidden sm:block">Olá, {user.nome}</span>
          <Link href="/home" className="text-white text-sm hidden sm:block hover:text-green-200 transition">Site</Link>
          <button
            onClick={() => { logout(); router.push('/home'); }}
            className="text-white text-sm border border-white px-3 py-1 rounded-lg hover:bg-white hover:text-green-600 transition duration-300"
          >
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <aside className="w-56 bg-white shadow-md hidden md:flex flex-col pt-6">
          <nav className="flex flex-col gap-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                  pathname === item.href
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Nav mobile */}
        <div className="md:hidden w-full bg-white border-b flex gap-1 px-3 py-2 overflow-x-auto absolute top-16 left-0 z-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition duration-200 ${
                pathname === item.href
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <main className="flex-1 p-6 bg-gray-50 md:mt-0 mt-10">{children}</main>
      </div>
    </div>
  );
}
