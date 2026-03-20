'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, Agendamento, StatusAgendamento } from '@/lib/api';

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

const statusOptions: StatusAgendamento[] = ['AGENDADO', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO'];

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    agendamentosApi.list().then(setAgendamentos).finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id: string, status: StatusAgendamento) => {
    setUpdating(id);
    try {
      const updated = await agendamentosApi.updateStatus(id, status);
      setAgendamentos((prev) => prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a)));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Agendamentos</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
        {agendamentos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Nenhum agendamento encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Animal</th>
                  <th className="px-4 py-3 font-medium">Tutor</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Hora</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{a.animal.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{a.tutor?.nome ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{tipoLabel[a.tipo]}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(a.data).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-gray-600">{a.horaInicio}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[a.status]}`}>
                        {statusLabel[a.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={a.status}
                        disabled={updating === a.id}
                        onChange={(e) => handleStatus(a.id, e.target.value as StatusAgendamento)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-green-600 disabled:opacity-50"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{statusLabel[s]}</option>
                        ))}
                      </select>
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
