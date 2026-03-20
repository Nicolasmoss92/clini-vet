'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, animaisApi, Agendamento, Animal, StatusAgendamento } from '@/lib/api';
import { AgendamentoForm } from '@/components/AgendamentoForm';

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

const filtros = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Pendentes', value: 'AGENDADO' },
  { label: 'Confirmados', value: 'CONFIRMADO' },
  { label: 'Concluídos', value: 'CONCLUIDO' },
  { label: 'Cancelados', value: 'CANCELADO' },
] as const;

const filtroColor: Record<string, string> = {
  TODOS: 'bg-gray-100 text-gray-700 border-gray-200',
  AGENDADO: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  CONFIRMADO: 'bg-blue-100 text-blue-700 border-blue-300',
  CONCLUIDO: 'bg-green-100 text-green-700 border-green-300',
  CANCELADO: 'bg-red-100 text-red-600 border-red-300',
};

const filtroColorActive: Record<string, string> = {
  TODOS: 'bg-gray-700 text-white border-gray-700',
  AGENDADO: 'bg-yellow-400 text-white border-yellow-400',
  CONFIRMADO: 'bg-blue-500 text-white border-blue-500',
  CONCLUIDO: 'bg-green-600 text-white border-green-600',
  CANCELADO: 'bg-red-500 text-white border-red-500',
};

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>('TODOS');
  const [busca, setBusca] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    Promise.all([agendamentosApi.list(), animaisApi.list()])
      .then(([ags, pets]) => { setAgendamentos(ags); setAnimais(pets); })
      .finally(() => setLoading(false));
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

  const lista = agendamentos
    .filter((a) => filtro === 'TODOS' || a.status === filtro)
    .filter((a) => !busca || a.animal.nome.toLowerCase().includes(busca.toLowerCase()) || a.tutor?.nome?.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600">Agendamentos</h1>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300"
        >
          {showForm ? 'Cancelar' : '+ Novo Agendamento'}
        </button>
      </div>

      {showForm && (
        <AgendamentoForm
          animais={animais}
          agendamentos={agendamentos}
          showTutor
          confirmOnCreate
          onSuccess={(novos) => {
            setAgendamentos((prev) => [...novos, ...prev]);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Busca */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar por animal ou tutor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full sm:w-80 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filtros.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFiltro(f.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition duration-200 ${
              filtro === f.value ? filtroColorActive[f.value] : filtroColor[f.value]
            }`}
          >
            {f.label}
            <span className="ml-1.5 opacity-75">
              ({f.value === 'TODOS' ? agendamentos.length : agendamentos.filter((a) => a.status === f.value).length})
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
        {lista.length === 0 ? (
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
                  <th className="px-4 py-3 font-medium">Descrição</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Ação</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{a.animal.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{a.tutor?.nome ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{tipoLabel[a.tipo]}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(a.data).toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-3 text-gray-600">{a.horaInicio}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px]">
                      {a.observacoes ? (
                        <span className="italic text-xs">{a.observacoes}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
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
