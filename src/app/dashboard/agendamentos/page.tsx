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

interface MedicamentoRow {
  nome: string;
  valor: string;
  quantidade: string;
}

interface ConcluirModal {
  agendamentoId: string;
  descricaoConsulta: string;
  valorServico: string;
  medicamentos: MedicamentoRow[];
}

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>('TODOS');
  const [busca, setBusca] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [modal, setModal] = useState<ConcluirModal | null>(null);

  useEffect(() => {
    Promise.all([agendamentosApi.list(), animaisApi.list()])
      .then(([ags, pets]) => { setAgendamentos(ags); setAnimais(pets); })
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id: string, status: StatusAgendamento) => {
    if (status === 'CONCLUIDO') {
      setModal({ agendamentoId: id, descricaoConsulta: '', valorServico: '', medicamentos: [] });
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

  const handleConcluir = async () => {
    if (!modal) return;
    setUpdating(modal.agendamentoId);
    try {
      const medicamentos = modal.medicamentos
        .filter((m) => m.nome.trim())
        .map((m) => ({
          nome: m.nome.trim(),
          valor: parseFloat(m.valor) || 0,
          quantidade: parseInt(m.quantidade) || 1,
        }));

      const updated = await agendamentosApi.updateStatus(modal.agendamentoId, 'CONCLUIDO', {
        descricaoConsulta: modal.descricaoConsulta || undefined,
        valorServico: modal.valorServico ? parseFloat(modal.valorServico) : undefined,
        medicamentos: medicamentos.length ? medicamentos : undefined,
      });

      setAgendamentos((prev) => prev.map((a) => (a.id === modal.agendamentoId ? { ...a, ...updated } : a)));
      setModal(null);
    } finally {
      setUpdating(null);
    }
  };

  const addMed = () =>
    setModal((m) => m ? { ...m, medicamentos: [...m.medicamentos, { nome: '', valor: '', quantidade: '1' }] } : m);

  const removeMed = (i: number) =>
    setModal((m) => m ? { ...m, medicamentos: m.medicamentos.filter((_, idx) => idx !== i) } : m);

  const updateMed = (i: number, field: keyof MedicamentoRow, value: string) =>
    setModal((m) => m ? {
      ...m,
      medicamentos: m.medicamentos.map((med, idx) => idx === i ? { ...med, [field]: value } : med),
    } : m);

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
      {/* Modal de Conclusão */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-700">Concluir Atendimento</h2>
              <p className="text-sm text-gray-400 mt-1">Preencha os detalhes do serviço realizado</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição do atendimento</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Consulta de rotina, exame físico completo..."
                  value={modal.descricaoConsulta}
                  onChange={(e) => setModal((m) => m ? { ...m, descricaoConsulta: e.target.value } : m)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor do serviço (R$)</label>
                <input
                  type="number" min="0" step="0.01"
                  placeholder="0,00"
                  value={modal.valorServico}
                  onChange={(e) => setModal((m) => m ? { ...m, valorServico: e.target.value } : m)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Medicamentos / Produtos</label>
                  <button type="button" onClick={addMed}
                    className="text-xs text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50 transition">
                    + Adicionar
                  </button>
                </div>

                {modal.medicamentos.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Nenhum medicamento adicionado.</p>
                ) : (
                  <div className="space-y-2">
                    {modal.medicamentos.map((med, i) => (
                      <div key={i} className="grid grid-cols-[1fr_100px_60px_32px] gap-2 items-center">
                        <input
                          placeholder="Nome do produto"
                          value={med.nome}
                          onChange={(e) => updateMed(i, 'nome', e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                        />
                        <input
                          type="number" min="0" step="0.01" placeholder="Valor"
                          value={med.valor}
                          onChange={(e) => updateMed(i, 'valor', e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                        />
                        <input
                          type="number" min="1" step="1" placeholder="Qtd"
                          value={med.quantidade}
                          onChange={(e) => updateMed(i, 'quantidade', e.target.value)}
                          className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                        />
                        <button type="button" onClick={() => removeMed(i)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition text-sm">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Resumo do total */}
              {(modal.valorServico || modal.medicamentos.some((m) => m.nome && m.valor)) && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>Serviço</span>
                    <span>R$ {parseFloat(modal.valorServico || '0').toFixed(2)}</span>
                  </div>
                  {modal.medicamentos.filter((m) => m.nome && m.valor).map((m, i) => (
                    <div key={i} className="flex justify-between text-gray-600 mb-1">
                      <span>{m.nome} × {m.quantidade || 1}</span>
                      <span>R$ {(parseFloat(m.valor || '0') * (parseInt(m.quantidade) || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold text-green-700 border-t border-green-200 pt-2 mt-2">
                    <span>Total</span>
                    <span>R$ {(
                      parseFloat(modal.valorServico || '0') +
                      modal.medicamentos.reduce((sum, m) => sum + (parseFloat(m.valor || '0') * (parseInt(m.quantidade) || 1)), 0)
                    ).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button type="button" onClick={() => setModal(null)}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">
                Cancelar
              </button>
              <button type="button" onClick={handleConcluir} disabled={updating === modal.agendamentoId}
                className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition disabled:opacity-50">
                {updating === modal.agendamentoId ? 'Salvando...' : 'Concluir Atendimento'}
              </button>
            </div>
          </div>
        </div>
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
