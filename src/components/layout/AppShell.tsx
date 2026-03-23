'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
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
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="CliniVet" className="h-10 object-contain" />
          <span className="text-white font-semibold text-sm hidden sm:block">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-green-100 text-sm hidden sm:block">Olá, {userName}</span>
          {showSiteLink && (
            <Link
              href="/home"
              className="bg-white text-green-600 text-sm border border-white px-3 py-1 rounded-lg hover:bg-green-50 transition duration-300 hidden sm:block"
            >
              Site
            </Link>
          )}
          <button
            onClick={onLogout}
            className="bg-white text-green-600 text-sm border border-white px-3 py-1 rounded-lg hover:bg-green-50 transition duration-300"
          >
            Sair
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

        <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
