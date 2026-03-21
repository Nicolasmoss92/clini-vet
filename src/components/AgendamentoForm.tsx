'use client';

import { useState } from 'react';
import { agendamentosApi, Agendamento, Animal, CreateAgendamentoData, TipoAgendamento } from '@/lib/api';
import { CalendarPicker } from '@/components/ui/CalendarPicker';
import { TimeSlotPicker } from '@/components/ui/TimeSlotPicker';

const tipoLabel: Record<string, string> = {
  CONSULTA: 'Consulta',
  BANHO_TOSA: 'Banho e Tosa',
  PETSITTER: 'Pet Sister',
};

interface FormState {
  animalId: string;
  tipo: TipoAgendamento;
  data: string;
  horaInicio: string;
  dias: string[];
  horaFim: string;
  observacoes: string;
}

interface Props {
  animais: Animal[];
  agendamentos: Agendamento[];
  showTutor?: boolean;
  confirmOnCreate?: boolean; // admin: cria já como CONFIRMADO
  onSuccess: (novos: Agendamento[]) => void;
  onCancel: () => void;
}

export function AgendamentoForm({ animais, agendamentos, showTutor = false, confirmOnCreate = false, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormState>({
    animalId: animais[0]?.id ?? '',
    tipo: 'CONSULTA',
    data: '', horaInicio: '',
    dias: [], horaFim: '', observacoes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isPetSister = form.tipo === 'PETSITTER';

  const occupiedDates = agendamentos
    .filter((a) => a.status !== 'CANCELADO')
    .map((a) => a.data.split('T')[0]);

  const occupiedTimesForDate = form.data
    ? agendamentos
        .filter((a) => a.data.split('T')[0] === form.data && a.status !== 'CANCELADO')
        .map((a) => a.horaInicio)
    : [];

  const handleTipoChange = (tipo: TipoAgendamento) =>
    setForm((f) => ({ ...f, tipo, data: '', horaInicio: '', dias: [], horaFim: '' }));

  const handleSubmit = async (e: React.FormEvent) => {
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
      const novos: Agendamento[] = [];

      if (isPetSister) {
        for (const dia of form.dias) {
          const payload: CreateAgendamentoData = {
            animalId: form.animalId,
            tipo: 'PETSITTER',
            data: dia,
            horaInicio: form.horaInicio,
            horaFim: form.horaFim,
            observacoes: form.observacoes || undefined,
            status: confirmOnCreate ? 'CONFIRMADO' : undefined,
          };
          novos.push(await agendamentosApi.create(payload));
        }
      } else {
        const payload: CreateAgendamentoData = {
          animalId: form.animalId,
          tipo: form.tipo,
          data: form.data,
          horaInicio: form.horaInicio,
          observacoes: form.observacoes || undefined,
          status: confirmOnCreate ? 'CONFIRMADO' : undefined,
        };
        novos.push(await agendamentosApi.create(payload));
      }

      onSuccess(novos);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Novo Agendamento</h2>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      {/* Pet e Tipo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pet *</label>
          <select
            required
            value={form.animalId}
            onChange={(e) => setForm({ ...form, animalId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
          >
            <option value="">Selecione...</option>
            {animais.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}{showTutor && a.tutor ? ` — ${a.tutor.nome}` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
          <select
            required
            value={form.tipo}
            onChange={(e) => handleTipoChange(e.target.value as TipoAgendamento)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
          >
            <option value="CONSULTA">Consulta</option>
            <option value="BANHO_TOSA">Banho e Tosa</option>
            <option value="PETSITTER">Pet Sister</option>
          </select>
        </div>
      </div>

      {/* Pet Sister — multi-dia */}
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
              <input type="time" value={form.horaInicio}
                onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Horário de fim *</label>
              <input type="time" value={form.horaFim}
                onChange={(e) => setForm((f) => ({ ...f, horaFim: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600" />
            </div>
          </div>
          {form.dias.length > 0 && form.horaInicio && form.horaFim && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 space-y-2">
              <p className="font-medium">✓ Resumo do agendamento:</p>
              <div className="flex flex-wrap gap-2">
                {form.animalId && (
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                    🐾 {animais.find((a) => a.id === form.animalId)?.nome ?? ''}
                  </span>
                )}
                <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium">Pet Sister</span>
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
        /* Calendário single + horários */
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
                  {tipoLabel[form.tipo]}
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
          placeholder="Ex: animal está com tosse há 2 dias, vacinas em dia..."
          value={form.observacoes}
          onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 resize-none"
        />
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          disabled={
            saving || !form.animalId ||
            (isPetSister ? form.dias.length === 0 || !form.horaInicio || !form.horaFim
              : !form.data || !form.horaInicio)
          }
          className="bg-green-600 text-white text-sm font-medium px-6 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvando...' : `Solicitar${isPetSister && form.dias.length > 1 ? ` (${form.dias.length} dias)` : ''}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm font-medium text-gray-500 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition duration-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
