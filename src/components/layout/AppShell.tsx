'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon, LogOut, ExternalLink } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface AppShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  userName: string;
  showSiteLink?: boolean;
  onLogout: () => void;
}

export function AppShell({ children, navItems, title, userName, showSiteLink, onLogout }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="bg-green-600 h-16 flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="CliniVet" className="h-7 w-7 object-contain" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-white font-bold text-base tracking-wide">CliniVet</span>
            <span className="text-green-200 text-xs font-medium">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {showSiteLink && (
            <Link
              href="/home"
              className="flex items-center gap-1.5 text-green-100 text-sm hover:text-white transition duration-200 hidden sm:flex"
            >
              <ExternalLink size={14} />
              Site
            </Link>
          )}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-green-500">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-white text-sm font-medium">{userName.split(' ')[0]}</span>
          </div>
          <button
            onClick={onLogout}
            title="Sair"
            className="flex items-center gap-1.5 text-green-100 hover:text-white text-sm transition duration-200 pl-3 border-l border-green-500"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden bg-white border-b flex gap-1 px-3 py-2 overflow-x-auto">
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

      <div className="flex flex-1">
        {/* Sidebar desktop */}
        <aside className="w-56 bg-white border-r border-gray-200 shadow-md hidden md:flex flex-col pt-6">
          <nav className="flex flex-col gap-1 px-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-3 ${
                  pathname === item.href
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {item.icon && <item.icon size={16} className="flex-shrink-0" />}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
