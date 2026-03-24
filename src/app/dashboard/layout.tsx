'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { LayoutDashboard, CalendarDays, ClipboardList, PawPrint, Users, TrendingUp } from 'lucide-react';

const navItems = [
  { label: 'Visão Geral',   href: '/dashboard',                icon: LayoutDashboard },
  { label: 'Agenda',        href: '/dashboard/agenda',         icon: CalendarDays },
  { label: 'Agendamentos',  href: '/dashboard/agendamentos',   icon: ClipboardList },
  { label: 'Animais',       href: '/dashboard/animais',        icon: PawPrint },
  { label: 'Tutores',       href: '/dashboard/tutores',        icon: Users },
  { label: 'Finanças',      href: '/dashboard/financas',       icon: TrendingUp },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.replace('/login');
    }
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
      title="Painel Veterinário"
      userName={user.nome}
      onLogout={() => { logout(); router.push('/home'); }}
    >
      {children}
    </AppShell>
  );
}
