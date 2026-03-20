'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, animaisApi, Agendamento, Animal, CreateAgendamentoData, TipoAgendamento } from '@/lib/api';
import { CalendarPicker } from '@/components/ui/CalendarPicker';
import { TimeSlotPicker } from '@/components/ui/TimeSlotPicker';

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

interface FormState {
  animalId: string;
  tipo: TipoAgendamento;
  // single
  data: string;
  horaInicio: string;
  // petsister
  dias: string[];
  horaFim: string;
}

export default function ClienteAgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [canceling, setCanceling] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    animalId: '', tipo: 'CONSULTA',
    data: '', horaInicio: '',
    dias: [], horaFim: '',
  });

  const isPetSister = form.tipo === 'PETSITTER';

  useEffect(() => {
    Promise.all([agendamentosApi.list(), animaisApi.list()])
      .then(([a, pets]) => { setAgendamentos(a); setAnimais(pets); })
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

  const resetForm = () => setForm({ animalId: '', tipo: 'CONSULTA', data: '', horaInicio: '', dias: [], horaFim: '' });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 space-y-1">
                  <p className="font-medium">✓ Resumo do serviço:</p>
                  <p>{form.dias.length} dia{form.dias.length > 1 ? 's' : ''} · {form.horaInicio} até {form.horaFim}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
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
                <div className="sm:col-span-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  ✓ {new Date(form.data + 'T00:00:00').toLocaleDateString('pt-BR')} às {form.horaInicio}
                </div>
              )}
            </div>
          )}

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
      <div className="flex flex-col gap-4">
        {agendamentos.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-md p-10 text-center">
            <p className="text-gray-400 text-sm">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          agendamentos.map((a) => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-md px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-700">{a.animal.nome}</p>
                <p className="text-sm text-gray-500">
                  {tipoLabel[a.tipo]} · {new Date(a.data).toLocaleDateString('pt-BR')} · {a.horaInicio}{a.horaFim ? ` até ${a.horaFim}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[a.status]}`}>
                  {statusLabel[a.status]}
                </span>
                {(a.status === 'AGENDADO' || a.status === 'CONFIRMADO') && (
                  <button onClick={() => handleCancel(a.id)} disabled={canceling === a.id}
                    className="text-xs text-red-500 border border-red-300 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-white transition duration-300 disabled:opacity-50">
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
