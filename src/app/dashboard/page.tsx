'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, animaisApi, usersApi, Agendamento } from '@/lib/api';
import Link from 'next/link';

const statusLabel: Record<string, string> = {
  AGENDADO: 'Agendado',
  CONFIRMADO: 'Confirmado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

const statusColor: Record<string, string> = {
  AGENDADO: 'bg-yellow-100 text-yellow-700',
  CONFIRMADO: 'bg-blue-100 text-blue-700',
  CONCLUIDO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-600',
};

const tipoLabel: Record<string, string> = {
  CONSULTA: 'Consulta',
  BANHO_TOSA: 'Banho e Tosa',
  PETSITTER: 'Pet Sister',
};

export default function DashboardPage() {
  const [totais, setTotais] = useState({ agendamentos: 0, animais: 0, tutores: 0 });
  const [proximos, setProximos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      agendamentosApi.list(),
      animaisApi.list(),
      usersApi.list(),
    ]).then(([agendamentos, animais, users]) => {
      const hoje = new Date().toISOString().split('T')[0];
      const proxs = agendamentos
        .filter((a) => a.data.split('T')[0] >= hoje && a.status !== 'CANCELADO' && a.status !== 'CONCLUIDO')
        .slice(0, 5);
      setProximos(proxs);
      setTotais({
        agendamentos: agendamentos.filter((a) => a.status === 'AGENDADO' || a.status === 'CONFIRMADO').length,
        animais: animais.length,
        tutores: users.filter((u) => u.role === 'TUTOR').length,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Visão Geral</h1>

      {/* Cards de totais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Agendamentos ativos', value: totais.agendamentos, href: '/dashboard/agendamentos' },
          { label: 'Animais cadastrados', value: totais.animais, href: '/dashboard/animais' },
          { label: 'Tutores', value: totais.tutores, href: '/dashboard/tutores' },
        ].map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6">
              <p className="text-sm text-gray-500 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-green-600">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Próximos agendamentos */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Próximos Agendamentos</h2>
          <Link href="/dashboard/agendamentos" className="text-sm text-green-600 hover:underline">Ver todos</Link>
        </div>

        {proximos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Nenhum agendamento próximo.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-medium">Animal</th>
                  <th className="pb-2 font-medium">Tipo</th>
                  <th className="pb-2 font-medium">Data</th>
                  <th className="pb-2 font-medium">Hora</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {proximos.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 font-medium text-gray-700">{a.animal.nome}</td>
                    <td className="py-3 text-gray-600">{tipoLabel[a.tipo]}</td>
                    <td className="py-3 text-gray-600">{new Date(a.data).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3 text-gray-600">{a.horaInicio}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[a.status]}`}>
                        {statusLabel[a.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
