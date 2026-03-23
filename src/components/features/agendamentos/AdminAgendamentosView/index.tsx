'use client';

import { useState } from 'react';
import { agendamentosApi, StatusAgendamento } from '@/lib/api';
import { useAgendamentos } from '@/hooks/useAgendamentos';
import { useAnimais } from '@/hooks/useAnimais';
import { usePaginatedList } from '@/hooks/usePaginatedList';
import { AgendamentoForm } from '@/components/AgendamentoForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';

import {
  TIPO_LABEL,
  STATUS_LABEL,
  STATUS_OPTIONS,
  FILTRO_OPTIONS,
  FILTRO_COLOR,
  FILTRO_COLOR_ACTIVE,
} from '@/lib/constants';
import { ConcluirAtendimentoModal } from '@/components/features/agendamentos/ConcluirAtendimentoModal';

export function AdminAgendamentosView() {
  const { agendamentos, setAgendamentos, loading: agLoading } = useAgendamentos();
  const { animais, loading: aniLoading } = useAnimais();
  const loading = agLoading || aniLoading;
  const [updating, setUpdating] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>('TODOS');
  const [busca, setBusca] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [concluirId, setConcluirId] = useState<string | null>(null);
  const PAGE_SIZE = 15;

  const handleStatus = async (id: string, status: StatusAgendamento) => {
    if (status === 'CONCLUIDO') {
      setConcluirId(id);
      return;
    }
    setUpdating(id);
    try {
      const updated = await agendamentosApi.updateStatus(id, status);
      setAgendamentos((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const lista = agendamentos
    .filter((a) => filtro === 'TODOS' || a.status === filtro)
    .filter((a) => !busca || a.animal.nome.toLowerCase().includes(busca.toLowerCase()) || a.tutor?.nome?.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => b.data.localeCompare(a.data) || b.horaInicio.localeCompare(a.horaInicio));

  const { page, setPage, paginated, totalPages, pageStart, pageEnd } = usePaginatedList(lista, PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Modal de Conclusão */}
      {concluirId && (
        <ConcluirAtendimentoModal
          agendamentoId={concluirId}
          onClose={() => setConcluirId(null)}
          onSuccess={(updated) => {
            setAgendamentos((prev) => prev.map((a) => (a.id === concluirId ? { ...a, ...updated } : a)));
            setConcluirId(null);
          }}
        />
      )}

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
          onChange={(e) => { setBusca(e.target.value); setPage(0); }}
          className="w-full sm:w-80 pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTRO_OPTIONS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => { setFiltro(f.value); setPage(0); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition duration-200 ${
              filtro === f.value ? FILTRO_COLOR_ACTIVE[f.value] : FILTRO_COLOR[f.value]
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
                {paginated.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{a.animal.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{a.tutor?.nome ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{TIPO_LABEL[a.tipo]}</td>
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
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={a.status}
                        disabled={updating === a.id}
                        onChange={(e) => handleStatus(a.id, e.target.value as StatusAgendamento)}
                        className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:border-green-600 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              {pageStart}–{pageEnd} de {lista.length} agendamentos
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
              >«</button>
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="px-3 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
              >‹ Anterior</button>

              {Array.from({ length: totalPages }, (_, i) => i)
                .filter((i) => i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 1)
                .reduce<(number | '...')[]>((acc, i, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === 'number' && (i as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(i);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-xs text-gray-400">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`w-8 h-7 text-xs rounded-lg border transition ${
                        page === item
                          ? 'bg-green-600 text-white border-green-600'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >{(item as number) + 1}</button>
                  )
                )}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages - 1}
                className="px-3 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
              >Próxima ›</button>
              <button
                onClick={() => setPage(totalPages - 1)}
                disabled={page === totalPages - 1}
                className="px-2 py-1 text-xs rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition"
              >»</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAgendamentosView;
