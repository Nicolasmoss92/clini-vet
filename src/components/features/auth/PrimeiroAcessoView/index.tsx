import Link from 'next/link';
import { PrimeiroAcessoForm } from './PrimeiroAcessoForm';

const steps = [
  'Informe o telefone cadastrado na clínica',
  'Adicione seu e-mail (opcional)',
  'Crie uma senha segura',
  'Acesse sua área do cliente',
];

export function PrimeiroAcessoView() {
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
              Bem-vindo à sua<br />área exclusiva
            </h2>
            <p className="text-green-100 mt-3 text-base leading-relaxed">
              Ative sua conta em poucos passos e tenha acesso completo ao histórico do seu pet.
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-green-100 text-sm">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold mt-0.5">
                  {i + 1}
                </div>
                {step}
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
            <PrimeiroAcessoForm />
          </div>
        </div>
      </div>

    </div>
  );
}
