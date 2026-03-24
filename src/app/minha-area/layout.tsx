'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { LayoutDashboard, PawPrint, CalendarCheck, Syringe, Receipt } from 'lucide-react';

const navItems = [
  { label: 'Visão Geral',          href: '/minha-area/visao-geral',           icon: LayoutDashboard },
  { label: 'Meus Pets',            href: '/minha-area',                       icon: PawPrint },
  { label: 'Agendamentos',         href: '/minha-area/agendamentos',          icon: CalendarCheck },
  { label: 'Vacinas',              href: '/minha-area/vacinas',               icon: Syringe },
  { label: 'Histórico Financeiro', href: '/minha-area/historico-financeiro',  icon: Receipt },
];

export default function MinhaAreaLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

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
    <AppShell
      navItems={navItems}
      title="Área do Cliente"
      userName={user.nome}
      showSiteLink
      onLogout={() => { logout(); router.push('/home'); }}
    >
      {children}
    </AppShell>
  );
}
