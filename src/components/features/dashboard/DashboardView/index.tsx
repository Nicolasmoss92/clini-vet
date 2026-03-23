'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, Agendamento } from '@/lib/api';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import { TIPO_LABEL } from '@/lib/constants';
import { Charts } from '@/components/features/dashboard/Charts';

export function DashboardView() {
  const [totais, setTotais] = useState({ agendamentos: 0, aguardando: 0, cancelados: 0 });
  const [todos, setTodos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agendamentosApi.list()
      .then((agendamentos) => {
        setTodos(agendamentos);
        setTotais({
          agendamentos: agendamentos.filter((a) => a.status === 'AGENDADO' || a.status === 'CONFIRMADO').length,
          aguardando: agendamentos.filter((a) => a.status === 'AGENDADO').length,
          cancelados: agendamentos.filter((a) => a.status === 'CANCELADO').length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Visão Geral</h1>

      {/* Cards de totais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Agendamentos ativos', value: totais.agendamentos, href: '/dashboard/agendamentos', top: 'border-t-green-600', text: 'text-green-600' },
          { label: 'Aguardando aprovação', value: totais.aguardando, href: '/dashboard/agendamentos', top: 'border-t-yellow-400', text: 'text-yellow-500' },
          { label: 'Cancelados', value: totais.cancelados, href: '/dashboard/agendamentos', top: 'border-t-red-500', text: 'text-red-500' },
        ].map((card) => (
          <Link key={card.label} href={card.href}>
            <div className={`bg-white rounded-xl border border-gray-100 border-t-4 ${card.top} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6`}>
              <p className="text-sm text-gray-500 mb-1">{card.label}</p>
              <p className={`text-3xl font-bold ${card.text}`}>{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Gráficos */}
      <Charts todos={todos} />

      {/* Próximos agendamentos */}
      {(() => {
        const todayISO = new Date().toISOString().split('T')[0];
        const proximos = todos
          .filter((a) => a.data.split('T')[0] >= todayISO && a.status !== 'CANCELADO' && a.status !== 'CONCLUIDO')
          .sort((a, b) => a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio))
          .slice(0, 5);
        return (
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
                        <td className="py-3 text-gray-600">{TIPO_LABEL[a.tipo]}</td>
                        <td className="py-3 text-gray-600">{new Date(a.data).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 text-gray-600">{a.horaInicio}</td>
                        <td className="py-3">
                          <StatusBadge status={a.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export default DashboardView;
