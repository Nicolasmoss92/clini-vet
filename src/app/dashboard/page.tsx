'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, Agendamento } from '@/lib/api';
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

const statusDot: Record<string, string> = {
  AGENDADO: 'bg-yellow-400',
  CONFIRMADO: 'bg-blue-400',
  CONCLUIDO: 'bg-green-500',
  CANCELADO: 'bg-red-400',
};

const tipoLabel: Record<string, string> = {
  CONSULTA: 'Consulta',
  BANHO_TOSA: 'Banho e Tosa',
  PETSITTER: 'Pet Sister',
};

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=dom, 1=seg...
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default function DashboardPage() {
  const [totais, setTotais] = useState({ agendamentos: 0, aguardando: 0, cancelados: 0 });
  const [todos, setTodos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOf(new Date()));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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
  const goToday = () => { setWeekStart(getMondayOf(new Date())); setSelectedDay(null); };

  const todayISO = toISO(new Date());
  const weekEnd = weekDays[6];
  const weekLabel = `${weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} – ${weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;

  const proximos = todos
    .filter((a) => a.data.split('T')[0] >= todayISO && a.status !== 'CANCELADO' && a.status !== 'CONCLUIDO')
    .sort((a, b) => a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio))
    .slice(0, 5);

  const now = new Date();
  const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const doMes = todos.filter((a) => a.data.split('T')[0].startsWith(mesAtual) && a.status !== 'CANCELADO');
  const totalMes = doMes.length || 1;
  const servicosMes = [
    { label: 'Consulta',     tipo: 'CONSULTA',   color: 'bg-green-500',  light: 'bg-green-100', text: 'text-green-700' },
    { label: 'Banho e Tosa', tipo: 'BANHO_TOSA', color: 'bg-blue-500',   light: 'bg-blue-100',  text: 'text-blue-700' },
    { label: 'Pet Sister',   tipo: 'PETSITTER',  color: 'bg-purple-500', light: 'bg-purple-100',text: 'text-purple-700' },
  ].map((s) => {
    const count = doMes.filter((a) => a.tipo === s.tipo).length;
    return { ...s, count, pct: Math.round((count / totalMes) * 100) };
  }).sort((a, b) => b.count - a.count);

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

      {/* Calendário semanal */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 mb-8">
        {/* Header navegação */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-700">Calendário da Semana</h2>
          <div className="flex items-center gap-2">
            <button type="button" onClick={prevWeek}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition text-lg leading-none">‹</button>
            <button type="button" onClick={goToday}
              className="text-xs text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50 transition">
              Hoje
            </button>
            <span className="text-sm font-medium text-gray-600 min-w-[180px] text-center">{weekLabel}</span>
            <button type="button" onClick={nextWeek}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition text-lg leading-none">›</button>
          </div>
        </div>

        {/* Grid Seg–Sex */}
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day, i) => {
            const iso = toISO(day);
            const ags = agByDay(iso);
            const isToday = iso === todayISO;
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
                {/* Cabeçalho do dia */}
                <div className={`px-3 py-2 border-b ${isToday ? 'border-green-200' : 'border-gray-100'}`}>
                  <p className="text-xs font-semibold text-gray-500 uppercase">{DIAS_SEMANA[i]}</p>
                  <p className={`text-lg font-bold leading-tight ${isToday ? 'text-green-600' : 'text-gray-700'}`}>
                    {day.getDate()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {day.toLocaleDateString('pt-BR', { month: 'short' })}
                  </p>
                </div>

                {/* Agendamentos do dia */}
                <div className="p-2 min-h-[100px] flex flex-col gap-1.5">
                  {ags.length === 0 ? (
                    <p className="text-xs text-gray-300 text-center mt-4">—</p>
                  ) : (
                    ags.slice(0, 4).map((a) => (
                      <div
                        key={a.id}
                        className={`flex items-start gap-1.5 px-2 py-1.5 rounded-lg text-xs ${statusColor[a.status]}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${statusDot[a.status]}`} />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{a.animal.nome}</p>
                          <p className="opacity-75">{a.horaInicio} · {tipoLabel[a.tipo]}</p>
                        </div>
                      </div>
                    ))
                  )}
                  {ags.length > 4 && (
                    <p className="text-xs text-gray-400 text-center">+{ags.length - 4} mais</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 flex-wrap">
          {Object.entries(statusLabel).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${statusDot[key]}`} />
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
                      <p className="text-xs text-gray-500">{tipoLabel[a.tipo]} · {a.horaInicio}{a.horaFim ? ` até ${a.horaFim}` : ''}</p>
                      {a.observacoes && <p className="text-xs text-gray-400 mt-0.5 italic">"{a.observacoes}"</p>}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-3 ${statusColor[a.status]}`}>
                      {statusLabel[a.status]}
                    </span>
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

      {/* Serviços do mês */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Serviços do Mês</h2>
          <span className="text-xs text-gray-400">
            {now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} · {doMes.length} agendamento{doMes.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {servicosMes.map((s, i) => (
            <div key={s.tipo} className={`rounded-xl p-4 ${s.light}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {i === 0 && <span className="text-xs font-bold text-gray-500">🥇</span>}
                  {i === 1 && <span className="text-xs font-bold text-gray-500">🥈</span>}
                  {i === 2 && <span className="text-xs font-bold text-gray-500">🥉</span>}
                  <span className={`text-sm font-semibold ${s.text}`}>{s.label}</span>
                </div>
                <span className={`text-xl font-bold ${s.text}`}>{s.pct}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-60 rounded-full h-2 mb-2">
                <div className={`${s.color} h-2 rounded-full transition-all duration-500`} style={{ width: `${s.pct}%` }} />
              </div>
              <p className={`text-xs ${s.text} opacity-75`}>{s.count} agendamento{s.count !== 1 ? 's' : ''}</p>
            </div>
          ))}
        </div>
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
