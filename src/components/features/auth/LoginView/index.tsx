import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { PawPrint } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

const brandPoints = [
  'Gerencie consultas e agendamentos',
  'Acompanhe o histórico do seu pet',
  'Acesse laudos e vacinas online',
  'Comunicação direta com a clínica',
];

export function LoginView() {
  return (
    <div className="min-h-screen flex">

      {/* Painel esquerdo — marca */}
      <div className="hidden lg:flex w-1/2 bg-green-600 flex-col justify-between p-12">
        <Link href="/home" className="flex items-center gap-3">
          <img src="/logo.png" alt="CliniVet" className="h-10 w-10 object-contain" />
          <span className="text-white font-bold text-xl tracking-wide">CliniVet</span>
        </Link>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white leading-snug">
              Saúde animal com<br />excelência e cuidado
            </h2>
            <p className="text-green-100 mt-3 text-base leading-relaxed">
              Acesse sua área exclusiva e gerencie tudo sobre a saúde do seu pet em um só lugar.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {brandPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-green-100 text-sm">
                <PawPrint size={16} className="text-green-300 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-green-300 text-xs">
          © {new Date().getFullYear()} CliniVet. Todos os direitos reservados.
        </p>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex flex-col">
        {/* Header mobile */}
        <div className="lg:hidden flex items-center px-6 py-4 border-b border-gray-100">
          <Link href="/home" className="flex items-center gap-2">
            <img src="/logo.png" alt="CliniVet" className="h-8 w-8 object-contain" />
            <span className="text-green-700 font-bold text-base">CliniVet</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <Suspense fallback={<LoadingSpinner />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>

    </div>
  );
}
