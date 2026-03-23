'use client';

import { useState } from 'react';
import { Agendamento } from '@/lib/api';
import { TIPO_SERVICO } from '@/lib/constants';

const TIPOS = TIPO_SERVICO;

function niceScale(maxVal: number, ticks = 4): number {
  if (maxVal === 0) return 4;
  const raw = maxVal / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const nice = [1, 2, 5, 10].find((n) => n * mag >= raw) ?? 10;
  return nice * mag * ticks;
}

export function Charts({ todos }: { todos: Agendamento[] }) {
  const hoje = new Date();
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // --- dados: agendamentos por mês (últimos 6) ---
  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - (5 - i), 1);
    return {
      label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
      year: d.getFullYear(),
      month: d.getMonth(),
      isCurrent: d.getFullYear() === hoje.getFullYear() && d.getMonth() === hoje.getMonth(),
    };
  });

  const agsPorMes = meses.map((m) => ({
    ...m,
    ativos: todos.filter((a) => {
      const d = new Date(a.data);
      return d.getFullYear() === m.year && d.getMonth() === m.month && a.status !== 'CANCELADO';
    }).length,
    cancelados: todos.filter((a) => {
      const d = new Date(a.data);
      return d.getFullYear() === m.year && d.getMonth() === m.month && a.status === 'CANCELADO';
    }).length,
  }));

  // --- dados: serviços este mês ---
  const mesAtual = todos.filter((a) => {
    const d = new Date(a.data);
    return d.getFullYear() === hoje.getFullYear() && d.getMonth() === hoje.getMonth();
  });

  const porTipo = TIPOS.map((t) => ({
    ...t,
    count: mesAtual.filter((a) => a.tipo === t.key).length,
  }));

  // --- SVG layout: gráfico de barras vertical ---
  const VW = 420, VH = 220;
  const pL = 38, pR = 12, pT = 16, pB = 36;
  const cW = VW - pL - pR;   // 370
  const cH = VH - pT - pB;   // 168

  const maxAtivos = Math.max(...agsPorMes.map((m) => m.ativos + m.cancelados), 1);
  const yMax = niceScale(maxAtivos);
  const NUM_TICKS = 4;
  const yTicks = Array.from({ length: NUM_TICKS + 1 }, (_, i) => Math.round((yMax / NUM_TICKS) * i));

  const groupW = cW / agsPorMes.length;
  const barW = Math.max(14, groupW * 0.55);
  const barOffset = (groupW - barW) / 2;

  // --- SVG layout: gráfico de barras horizontal ---
  const HW = 340, HH = 200;
  const hpL = 84, hpR = 44, hpT = 20, hpB = 30;
  const hcW = HW - hpL - hpR;  // 212
  const hcH = HH - hpT - hpB;  // 150

  const maxTipo = Math.max(...porTipo.map((t) => t.count), 1);
  const xMax = niceScale(maxTipo, 3);
  const X_TICKS = 3;
  const xTicks = Array.from({ length: X_TICKS + 1 }, (_, i) => Math.round((xMax / X_TICKS) * i));

  const rowH = hcH / porTipo.length;
  const hBarH = Math.min(28, rowH * 0.5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">

      {/* === Barras verticais: agendamentos por mês === */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-md p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">Agendamentos por mês</h2>
            <p className="text-xs text-gray-400 mt-0.5">Últimos 6 meses</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#10b981' }} />Ativos
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: '#ef4444' }} />Cancelados
            </span>
          </div>
        </div>

        <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ overflow: 'visible' }}>

          {/* Grid lines + Y labels */}
          {yTicks.map((tick) => {
            const y = pT + cH - (tick / yMax) * cH;
            return (
              <g key={tick}>
                <line x1={pL} y1={y} x2={pL + cW} y2={y}
                  stroke={tick === 0 ? '#d1d5db' : '#f3f4f6'} strokeWidth={tick === 0 ? 1.5 : 1} />
                <text x={pL - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#9ca3af">
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Y axis line */}
          <line x1={pL} y1={pT} x2={pL} y2={pT + cH} stroke="#e5e7eb" strokeWidth={1} />

          {/* Bars */}
          {agsPorMes.map((m, i) => {
            const x = pL + i * groupW + barOffset;
            const hAtivo = m.ativos > 0 ? Math.max(3, (m.ativos / yMax) * cH) : 0;
            const hCanc  = m.cancelados > 0 ? Math.max(3, (m.cancelados / yMax) * cH) : 0;
            const yAtivo = pT + cH - hAtivo;
            const yCanc  = pT + cH - hAtivo - hCanc;
            const xCenter = x + barW / 2;
            const isHovered = hoveredBar === i;
            const totalH = hAtivo + hCanc;
            const topY = totalH > 0 ? pT + cH - totalH : pT + cH;

            // tooltip position: flip para esquerda nos últimos 2 meses
            const tooltipX = i >= agsPorMes.length - 2 ? x - 62 : x + barW + 6;

            return (
              <g key={`${m.year}-${m.month}`}
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{ cursor: 'default' }}
              >
                {/* Área invisível para capturar hover */}
                <rect x={x - 4} y={pT} width={barW + 8} height={cH} fill="transparent" />

                {/* Barra cancelados (acima da ativa) */}
                {hCanc > 0 && (
                  <rect x={x} y={yCanc} width={barW} height={hCanc} rx={3}
                    fill="#ef4444" opacity={isHovered ? 1 : 0.85} />
                )}
                {/* Barra ativos */}
                {hAtivo > 0 && (
                  <rect x={x} y={yAtivo} width={barW} height={hAtivo}
                    rx={4} fill="#10b981"
                    opacity={isHovered ? 1 : m.isCurrent ? 0.9 : 0.7}
                  />
                )}

                {/* Tooltip */}
                {isHovered && (m.ativos + m.cancelados) > 0 && (
                  <g>
                    <rect x={tooltipX} y={topY - 8} width={58} height={m.cancelados > 0 ? 46 : 28}
                      rx={6} fill="#1f2937" opacity={0.92} />
                    <text x={tooltipX + 29} y={topY + 8} textAnchor="middle" fontSize={10} fill="#d1fae5" fontWeight="600">
                      ✓ {m.ativos} ativo{m.ativos !== 1 ? 's' : ''}
                    </text>
                    {m.cancelados > 0 && (
                      <text x={tooltipX + 29} y={topY + 24} textAnchor="middle" fontSize={10} fill="#fca5a5" fontWeight="600">
                        ✕ {m.cancelados} cancel.
                      </text>
                    )}
                  </g>
                )}

                {/* Label do mês (X axis) */}
                <text x={xCenter} y={pT + cH + 20}
                  textAnchor="middle" fontSize={11}
                  fill={m.isCurrent ? '#059669' : '#9ca3af'}
                  fontWeight={m.isCurrent ? '600' : '400'}
                  style={{ textTransform: 'capitalize' }}>
                  {m.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* === Barras horizontais: serviços este mês === */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-md p-5">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Serviços este mês</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            {' · '}
            <span className="font-medium text-gray-600">{mesAtual.length} atendimentos</span>
          </p>
        </div>

        <svg viewBox={`0 0 ${HW} ${HH}`} className="w-full" style={{ overflow: 'visible' }}>
          {/* X grid lines + labels */}
          {xTicks.map((tick) => {
            const x = hpL + (tick / xMax) * hcW;
            return (
              <g key={tick}>
                <line x1={x} y1={hpT} x2={x} y2={hpT + hcH}
                  stroke={tick === 0 ? '#d1d5db' : '#f3f4f6'}
                  strokeWidth={tick === 0 ? 1.5 : 1} />
                <text x={x} y={hpT + hcH + 18} textAnchor="middle" fontSize={10} fill="#9ca3af">
                  {tick}
                </text>
              </g>
            );
          })}

          {/* X axis label */}
          <text x={hpL + hcW / 2} y={HH - 2} textAnchor="middle" fontSize={9} fill="#d1d5db">
            quantidade
          </text>

          {/* Y axis line */}
          <line x1={hpL} y1={hpT} x2={hpL} y2={hpT + hcH} stroke="#e5e7eb" strokeWidth={1} />

          {/* Horizontal bars */}
          {porTipo.map((t, i) => {
            const bw = t.count > 0 ? Math.max(4, (t.count / xMax) * hcW) : 0;
            const y = hpT + i * rowH + (rowH - hBarH) / 2;
            const yCenter = y + hBarH / 2 + 4;

            return (
              <g key={t.key}>
                {/* Y label */}
                <text x={hpL - 8} y={yCenter} textAnchor="end" fontSize={11} fill="#6b7280">
                  {t.label}
                </text>
                {/* Track */}
                <rect x={hpL} y={y} width={hcW} height={hBarH} rx={6} fill="#f3f4f6" />
                {/* Bar */}
                {bw > 0 && (
                  <rect x={hpL} y={y} width={bw} height={hBarH} rx={6} fill={t.color1} />
                )}
                {/* Value label */}
                <text x={hpL + bw + 6} y={yCenter} textAnchor="start" fontSize={11}
                  fill={t.color1} fontWeight="600">
                  {t.count}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Mini totais */}
        <div className="grid grid-cols-2 gap-2 mt-1 pt-3 border-t border-gray-100">
          {[
            { label: 'Confirmados', value: mesAtual.filter((a) => a.status === 'CONFIRMADO').length, color: '#0ea5e9' },
            { label: 'Concluídos',  value: mesAtual.filter((a) => a.status === 'CONCLUIDO').length,  color: '#10b981' },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl px-3 py-2 text-center">
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Charts;
