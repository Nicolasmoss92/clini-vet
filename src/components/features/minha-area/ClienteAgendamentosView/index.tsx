'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, animaisApi, Agendamento, Animal, CreateAgendamentoData, TipoAgendamento } from '@/lib/api';
import { CalendarPicker } from '@/components/ui/CalendarPicker';
import { TimeSlotPicker } from '@/components/ui/TimeSlotPicker';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import { TIPO_LABEL, STATUS_LABEL, STATUS_COLOR } from '@/lib/constants';

interface FormState {
  animalId: string;
  tipo: TipoAgendamento;
  // single
  data: string;
  horaInicio: string;
  // petsister
  dias: string[];
  horaFim: string;
  observacoes: string;
}

export function ClienteAgendamentosView() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState<string | null>(null);
  const [expandedAg, setExpandedAg] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    animalId: '', tipo: 'CONSULTA',
    data: '', horaInicio: '',
    dias: [], horaFim: '', observacoes: '',
  });

  const isPetSister = form.tipo === 'PETSITTER';

  useEffect(() => {
    Promise.all([agendamentosApi.list(), animaisApi.list()])
      .then(([a, pets]) => {
        setAgendamentos(a);
        setAnimais(pets);
        if (pets.length > 0) setForm((f) => ({ ...f, animalId: f.animalId || pets[0].id }));
      })
      .finally(() => setLoading(false));
  }, []);

  const occupiedDates = agendamentos
    .filter((a) => a.status !== 'CANCELADO')
    .map((a) => a.data.split('T')[0]);

  const occupiedTimesForDate = form.data
    ? agendamentos
        .filter((a) => a.data.split('T')[0] === form.data && a.status !== 'CANCELADO')
        .map((a) => a.horaInicio)
    : [];

  const resetForm = () => setForm({ animalId: animais[0]?.id ?? '', tipo: 'CONSULTA', data: '', horaInicio: '', dias: [], horaFim: '', observacoes: '' });

  const handleTipoChange = (tipo: TipoAgendamento) =>
    setForm((f) => ({ ...f, tipo, data: '', horaInicio: '', dias: [], horaFim: '' }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isPetSister) {
      if (form.dias.length === 0) { setError('Selecione ao menos um dia.'); return; }
      if (!form.horaInicio) { setError('Informe o horário de início.'); return; }
      if (!form.horaFim) { setError('Informe o horário de fim.'); return; }
      if (form.horaFim <= form.horaInicio) { setError('Horário de fim deve ser após o início.'); return; }
    } else {
      if (!form.data) { setError('Selecione uma data.'); return; }
      if (!form.horaInicio) { setError('Selecione um horário.'); return; }
    }

    setSaving(true);
    try {
      if (isPetSister) {
        // cria um agendamento por dia selecionado
        const novos: Agendamento[] = [];
        for (const dia of form.dias) {
          const payload: CreateAgendamentoData = {
            animalId: form.animalId,
            tipo: 'PETSITTER',
            data: dia,
            horaInicio: form.horaInicio,
            horaFim: form.horaFim,
            observacoes: form.observacoes || undefined,
          };
          const novo = await agendamentosApi.create(payload);
          novos.push(novo);
        }
        setAgendamentos((prev) => [...novos, ...prev]);
      } else {
        const payload: CreateAgendamentoData = {
          animalId: form.animalId,
          tipo: form.tipo,
          data: form.data,
          horaInicio: form.horaInicio,
          observacoes: form.observacoes || undefined,
        };
        const novo = await agendamentosApi.create(payload);
        setAgendamentos((prev) => [novo, ...prev]);
      }
      setShowForm(false);
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Cancelar este agendamento?')) return;
    setCanceling(id);
    try {
      await agendamentosApi.updateStatus(id, 'CANCELADO');
      setAgendamentos((prev) => prev.map((a) => a.id === id ? { ...a, status: 'CANCELADO' } : a));
    } finally {
      setCanceling(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600">Meus Agendamentos</h1>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); resetForm(); }}
          className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300"
        >
          {showForm ? 'Cancelar' : '+ Novo Agendamento'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Solicitar Agendamento</h2>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Pet e Tipo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet *</label>
              <select required value={form.animalId} onChange={(e) => setForm({ ...form, animalId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600">
                <option value="">Selecione...</option>
                {animais.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
              <select required value={form.tipo} onChange={(e) => handleTipoChange(e.target.value as TipoAgendamento)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600">
                <option value="CONSULTA">Consulta</option>
                <option value="BANHO_TOSA">Banho e Tosa</option>
                <option value="PETSITTER">Pet Sister</option>
              </select>
            </div>
          </div>

          {/* PET SISTER — multi-dia + início/fim */}
          {isPetSister ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dias do serviço *
                  <span className="ml-2 font-normal text-gray-400">clique para selecionar/desselecionar</span>
                </label>
                <CalendarPicker
                  multi
                  selectedDates={form.dias}
                  onSelectDates={(dias) => setForm((f) => ({ ...f, dias }))}
                  occupiedDates={occupiedDates}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário de início *</label>
                  <input
                    type="time"
                    value={form.horaInicio}
                    onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário de fim *</label>
                  <input
                    type="time"
                    value={form.horaFim}
                    onChange={(e) => setForm((f) => ({ ...f, horaFim: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>

              {/* Resumo Pet Sister */}
              {form.dias.length > 0 && form.horaInicio && form.horaFim && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 space-y-2">
                  <p className="font-medium">✓ Resumo do agendamento:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.animalId && (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        🐾 {animais.find((a) => a.id === form.animalId)?.nome ?? ''}
                      </span>
                    )}
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      Pet Sister
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      {form.dias.length} dia{form.dias.length > 1 ? 's' : ''} · 🕐 {form.horaInicio} até {form.horaFim}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {form.dias.map((d) => (
                      <span key={d} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                        {new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* OUTROS TIPOS — calendário single + grid de horários */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
                <CalendarPicker
                  selectedDate={form.data}
                  onSelectDate={(d) => setForm((f) => ({ ...f, data: d, horaInicio: '' }))}
                  occupiedDates={occupiedDates}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário *
                  {form.data && (
                    <span className="ml-2 font-normal text-gray-400">
                      {new Date(form.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  )}
                </label>
                {form.data ? (
                  <TimeSlotPicker
                    selectedTime={form.horaInicio}
                    onSelectTime={(t) => setForm((f) => ({ ...f, horaInicio: t }))}
                    occupiedTimes={occupiedTimesForDate}
                  />
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-md p-8 flex items-center justify-center h-full">
                    <p className="text-sm text-gray-400 text-center">Selecione uma data<br />para ver os horários</p>
                  </div>
                )}
              </div>

              {form.data && form.horaInicio && (
                <div className="sm:col-span-2 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 space-y-2">
                  <p className="font-medium">✓ Resumo do agendamento:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.animalId && (
                      <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                        🐾 {animais.find((a) => a.id === form.animalId)?.nome ?? ''}
                      </span>
                    )}
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      {TIPO_LABEL[form.tipo]}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      📅 {new Date(form.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      🕐 {form.horaInicio}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Descrição */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="font-normal text-gray-400">(opcional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Ex: meu pet está com tosse há 2 dias, vacinas em dia..."
              value={form.observacoes}
              onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={
              saving || !form.animalId ||
              (isPetSister ? form.dias.length === 0 || !form.horaInicio || !form.horaFim
                : !form.data || !form.horaInicio)
            }
            className="mt-4 bg-green-600 text-white text-sm font-medium px-6 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Enviando...' : `Solicitar${isPetSister && form.dias.length > 1 ? ` (${form.dias.length} dias)` : ''}`}
          </button>
        </form>
      )}

      {/* Lista de agendamentos */}
      {agendamentos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-10 text-center">
          <p className="text-gray-400 text-sm">Nenhum agendamento encontrado.</p>
        </div>
      ) : (
        (() => {
          const ordem: Record<string, number> = { CONFIRMADO: 0, AGENDADO: 1, CONCLUIDO: 2, CANCELADO: 3 };
          const grupos: Record<string, typeof agendamentos> = { CONFIRMADO: [], AGENDADO: [], CONCLUIDO: [], CANCELADO: [] };
          [...agendamentos].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
            .forEach((a) => grupos[a.status]?.push(a));

          const grupoLabel: Record<string, string> = {
            CONFIRMADO: 'Confirmados',
            AGENDADO: 'Pendentes',
            CONCLUIDO: 'Concluídos',
            CANCELADO: 'Cancelados',
          };

          return (
            <div className="flex flex-col gap-6">
              {Object.keys(ordem).map((status) => {
                const lista = grupos[status];
                if (lista.length === 0) return null;
                return (
                  <div key={status}>
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                      {grupoLabel[status]} ({lista.length})
                    </h2>
                    <div className="flex flex-col gap-3">
                      {lista.map((a) => {
                        const foto = animais.find((p) => p.id === a.animalId)?.foto ?? null;
                        const isExpanded = expandedAg === a.id;
                        return (
                          <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
                            {/* Cabeçalho do card */}
                            <button
                              type="button"
                              onClick={() => setExpandedAg(isExpanded ? null : a.id)}
                              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-200 bg-green-50 flex items-center justify-center flex-shrink-0">
                                  {foto ? (
                                    <img src={foto} alt={a.animal.nome} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-green-400 text-base">🐾</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-700">{a.animal.nome}</p>
                                  <p className="text-sm text-gray-500">
                                    {TIPO_LABEL[a.tipo]} · {new Date(a.data).toLocaleDateString('pt-BR')} · {a.horaInicio}{a.horaFim ? ` até ${a.horaFim}` : ''}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <StatusBadge status={a.status} />
                                <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
                              </div>
                            </button>

                            {/* Detalhes expandidos */}
                            {isExpanded && (
                              <div className="border-t px-6 py-4 bg-gray-50 space-y-3">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Data</p>
                                    <p className="font-medium text-gray-700">
                                      {new Date(a.data).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Horário</p>
                                    <p className="font-medium text-gray-700">
                                      {a.horaInicio}{a.horaFim ? ` até ${a.horaFim}` : ''}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Tipo</p>
                                    <p className="font-medium text-gray-700">{TIPO_LABEL[a.tipo]}</p>
                                  </div>
                                </div>

                                {a.observacoes && (
                                  <div>
                                    <p className="text-xs text-gray-400 mb-0.5">Descrição</p>
                                    <p className="text-sm text-gray-700 bg-white border border-gray-100 rounded-lg px-3 py-2">{a.observacoes}</p>
                                  </div>
                                )}

                                {/* Nota fiscal — só para atendimentos concluídos */}
                                {a.status === 'CONCLUIDO' && (a.descricaoConsulta || a.valorServico != null || (a.medicamentos?.length ?? 0) > 0) && (
                                  <div className="border border-green-200 rounded-xl overflow-hidden">
                                    <div className="bg-green-600 px-4 py-2 flex items-center justify-between">
                                      <span className="text-xs font-semibold text-white uppercase tracking-wide">Resumo do Atendimento</span>
                                    </div>
                                    <div className="bg-white px-4 py-3 space-y-3 text-sm">
                                      {a.descricaoConsulta && (
                                        <div>
                                          <p className="text-xs text-gray-400 mb-0.5">O que foi feito</p>
                                          <p className="text-gray-700">{a.descricaoConsulta}</p>
                                        </div>
                                      )}

                                      {(a.medicamentos?.length ?? 0) > 0 && (
                                        <div>
                                          <p className="text-xs text-gray-400 mb-1.5">Medicamentos / Produtos</p>
                                          <div className="space-y-1">
                                            {a.medicamentos.map((m) => (
                                              <div key={m.id} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                                                <span className="text-gray-700 font-medium">{m.nome} <span className="font-normal text-gray-400">× {m.quantidade}</span></span>
                                                <span className="text-gray-600">R$ {(m.valor * m.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      <div className="border-t pt-3 space-y-1">
                                        {a.valorServico != null && (
                                          <div className="flex justify-between text-xs text-gray-500">
                                            <span>Serviço</span>
                                            <span>R$ {a.valorServico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                          </div>
                                        )}
                                        {(a.medicamentos?.length ?? 0) > 0 && (
                                          <div className="flex justify-between text-xs text-gray-500">
                                            <span>Medicamentos</span>
                                            <span>R$ {a.medicamentos.reduce((s, m) => s + m.valor * m.quantidade, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                          </div>
                                        )}
                                        <div className="flex justify-between font-semibold text-sm text-green-700 pt-1">
                                          <span>Total</span>
                                          <span>R$ {(
                                            (a.valorServico ?? 0) +
                                            (a.medicamentos ?? []).reduce((s, m) => s + m.valor * m.quantidade, 0)
                                          ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {(a.status === 'AGENDADO' || a.status === 'CONFIRMADO') && (
                                  <button
                                    type="button"
                                    onClick={() => handleCancel(a.id)}
                                    disabled={canceling === a.id}
                                    className="text-xs text-red-500 border border-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition duration-300 disabled:opacity-50"
                                  >
                                    {canceling === a.id ? 'Cancelando...' : 'Cancelar agendamento'}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()
      )}
    </div>
  );
}

export default ClienteAgendamentosView;
