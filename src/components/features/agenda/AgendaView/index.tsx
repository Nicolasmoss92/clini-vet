'use client';

import { useState } from 'react';

import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import { TIPO_LABEL, STATUS_LABEL, STATUS_COLOR, STATUS_DOT } from '@/lib/constants';
import { useAgendamentos } from '@/hooks/useAgendamentos';

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function AgendaView() {
  const { agendamentos: todos, loading } = useAgendamentos();
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOf(new Date()));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const agByDay = (iso: string) =>
    todos
      .filter((a) => a.data.split('T')[0] === iso)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const prevWeek = () => setWeekStart((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
  const nextWeek = () => setWeekStart((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });
  const goToday  = () => { setWeekStart(getMondayOf(new Date())); setSelectedDay(null); };

  const todayISO = toISO(new Date());
  const weekEnd  = weekDays[6];
  const weekLabel = `${weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} – ${weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600">Agenda</h1>
        <Link href="/dashboard/agendamentos"
          className="text-sm text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition">
          Ver todos os agendamentos
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6">
        {/* Controles de navegação */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-lg font-semibold text-gray-700">Calendário Semanal</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={prevWeek}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition text-lg leading-none">‹</button>
            <button type="button" onClick={goToday}
              className="text-xs text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50 transition">
              Hoje
            </button>
            <span className="text-sm font-medium text-gray-600 text-center">{weekLabel}</span>
            <button type="button" onClick={nextWeek}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition text-lg leading-none">›</button>
          </div>
        </div>

        {/* Grade semanal */}
        <div className="overflow-x-auto -mx-2 px-2">
          <div className="grid grid-cols-7 gap-2 min-w-[560px]">
            {weekDays.map((day, i) => {
              const iso = toISO(day);
              const ags = agByDay(iso);
              const isToday    = iso === todayISO;
              const isSelected = selectedDay === iso;

              return (
                <div
                  key={iso}
                  onClick={() => setSelectedDay(isSelected ? null : iso)}
                  className={`rounded-xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-green-500 shadow-md'
                      : isToday
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`px-3 py-2 border-b ${isToday ? 'border-green-200' : 'border-gray-100'}`}>
                    <p className="text-xs font-semibold text-gray-500 uppercase">{DIAS_SEMANA[i]}</p>
                    <p className={`text-lg font-bold leading-tight ${isToday ? 'text-green-600' : 'text-gray-700'}`}>
                      {day.getDate()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {day.toLocaleDateString('pt-BR', { month: 'short' })}
                    </p>
                  </div>

                  <div className="p-2 min-h-[100px] flex flex-col gap-1.5">
                    {ags.length === 0 ? (
                      <p className="text-xs text-gray-300 text-center mt-4">—</p>
                    ) : (
                      ags.map((a) => (
                        <div key={a.id}
                          className={`flex items-start gap-1.5 px-2 py-1.5 rounded-lg text-xs ${STATUS_COLOR[a.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${STATUS_DOT[a.status]}`} />
                          <div className="min-w-0">
                            <p className="font-medium truncate">{a.animal.nome}</p>
                            <p className="opacity-75">{a.horaInicio} · {TIPO_LABEL[a.tipo]}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 flex-wrap">
          {Object.entries(STATUS_LABEL).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[key]}`} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Detalhe do dia selecionado */}
        {selectedDay && (() => {
          const ags = agByDay(selectedDay);
          const dataFormatada = new Date(selectedDay + 'T00:00:00').toLocaleDateString('pt-BR', {
            weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
          });
          return ags.length > 0 ? (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 capitalize">{dataFormatada}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ags.map((a) => (
                  <div key={a.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{a.animal.nome}</p>
                      <p className="text-xs text-gray-500">
                        {TIPO_LABEL[a.tipo]} · {a.horaInicio}{a.horaFim ? ` até ${a.horaFim}` : ''}
                      </p>
                      {a.observacoes && <p className="text-xs text-gray-400 mt-0.5 italic">&quot;{a.observacoes}&quot;</p>}
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-400">Nenhum agendamento neste dia.</p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

export default AgendaView;
