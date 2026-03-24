'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, Agendamento, CategoriaDespesa, CreateDespesaData } from '@/lib/api';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CATEGORIA_LABEL, CATEGORIA_OPTIONS, TIPO_LABEL } from '@/lib/constants';
import { useDespesas } from '@/hooks/useDespesas';
import { despesasApi } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

const SERVICOS = [
  { tipo: 'CONSULTA',   label: 'Consulta',     stroke: '#16a34a', light: 'bg-green-100',  text: 'text-green-700',  bar: 'bg-green-500'  },
  { tipo: 'BANHO_TOSA', label: 'Banho e Tosa', stroke: '#ea580c', light: 'bg-orange-100', text: 'text-orange-700', bar: 'bg-orange-500' },
  { tipo: 'PETSITTER',  label: 'Pet Sister',   stroke: '#7c3aed', light: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500' },
];

// SVG Donut chart — radius 54, cx/cy 64
const R = 54;
const CX = 64;
const CY = 64;
const CIRC = 2 * Math.PI * R; // ≈ 339.3

interface DonutSegment { pct: number; stroke: string; label: string }

function DonutChart({ segments, center }: { segments: DonutSegment[]; center: string }) {
  let offset = 0;
  // start from top (-90°) → dashoffset = CIRC/4
  const startOffset = CIRC / 4;

  return (
    <svg viewBox="0 0 128 128" className="w-40 h-40">
      {/* background track */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f3f4f6" strokeWidth="16" />

      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * CIRC;
        const dashOffset = startOffset - offset * (CIRC / 100) * 1; // rotated offset
        // Actually simpler: use strokeDashoffset per segment
        const segOffset = CIRC - (offset / 100) * CIRC + startOffset;
        offset += seg.pct;
        if (seg.pct === 0) return null;
        return (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={seg.stroke}
            strokeWidth="16"
            strokeDasharray={`${dash} ${CIRC - dash}`}
            strokeDashoffset={segOffset}
            strokeLinecap="butt"
          />
        );
      })}

      {/* center label */}
      <text x={CX} y={CY - 6} textAnchor="middle" className="text-xs" fontSize="10" fill="#374151" fontWeight="600">
        {center}
      </text>
      <text x={CX} y={CY + 8} textAnchor="middle" fontSize="8" fill="#9ca3af">
        total
      </text>
    </svg>
  );
}

const FORM_EMPTY: CreateDespesaData = {
  descricao: '',
  categoria: 'OUTROS',
  valor: 0,
  data: new Date().toISOString().split('T')[0],
};

export function FinancasView() {
  const { showToast } = useToast();
  const [todos, setTodos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateDespesaData>(FORM_EMPTY);
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const mesAtual = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { despesas, setDespesas } = useDespesas(mesAtual);

  useEffect(() => {
    agendamentosApi.list().then(setTodos).finally(() => setLoading(false));
  }, []);

  const handleCreateDespesa = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const nova = await despesasApi.create(form);
      setDespesas((prev) => [nova, ...prev]);
      setForm(FORM_EMPTY);
      setShowModal(false);
      showToast('Despesa lançada com sucesso!');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Erro ao lançar despesa.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDespesa = async (id: string) => {
    if (!confirm('Remover esta despesa?')) return;
    await despesasApi.remove(id);
    setDespesas((prev) => prev.filter((d) => d.id !== id));
    showToast('Despesa removida.', 'info');
  };

  if (loading) return <LoadingSpinner />;

  const mesLabel = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const doMes = todos.filter((a) => a.data.split('T')[0].startsWith(mesAtual) && a.status !== 'CANCELADO');
  const concluidosMes = doMes.filter((a) => a.status === 'CONCLUIDO');

  const receitaTotal = concluidosMes.reduce((sum, a) => {
    return sum + (a.valorServico ?? 0) + (a.medicamentos ?? []).reduce((s, m) => s + m.valor * m.quantidade, 0);
  }, 0);

  const receitaMedicamentos = concluidosMes.reduce((sum, a) =>
    sum + (a.medicamentos ?? []).reduce((s, m) => s + m.valor * m.quantidade, 0), 0);

  const receitaServicos = receitaTotal - receitaMedicamentos;
  const ticketMedio = concluidosMes.length > 0 ? receitaTotal / concluidosMes.length : 0;

  // Receita e contagem por tipo de serviço
  const totalMes = doMes.length || 1;
  const porTipo = SERVICOS.map((s) => {
    const ags = doMes.filter((a) => a.tipo === s.tipo);
    const concluidos = ags.filter((a) => a.status === 'CONCLUIDO');
    const receita = concluidos.reduce((sum, a) =>
      sum + (a.valorServico ?? 0) + (a.medicamentos ?? []).reduce((ss, m) => ss + m.valor * m.quantidade, 0), 0);
    return { ...s, count: ags.length, concluidos: concluidos.length, receita, pct: Math.round((ags.length / totalMes) * 100) };
  }).sort((a, b) => b.count - a.count);

  // Donut de receita por tipo
  const totalReceita = receitaTotal || 1;
  const receitaSegments: DonutSegment[] = porTipo.map((s) => ({
    pct: Math.round((s.receita / totalReceita) * 100),
    stroke: s.stroke,
    label: s.label,
  }));
  // ajusta para somar 100
  const diff = 100 - receitaSegments.reduce((s, x) => s + x.pct, 0);
  if (receitaSegments.length > 0) receitaSegments[0].pct += diff;

  // Donut de atendimentos por tipo
  const atendimentosSegments: DonutSegment[] = porTipo.map((s) => ({
    pct: s.pct,
    stroke: s.stroke,
    label: s.label,
  }));
  const diff2 = 100 - atendimentosSegments.reduce((s, x) => s + x.pct, 0);
  if (atendimentosSegments.length > 0) atendimentosSegments[0].pct += diff2;

  // Histórico de concluídos do mês
  const historico = concluidosMes
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 20);

  const totalDespesas = despesas.reduce((s, d) => s + d.valor, 0);
  const lucroLiquido = receitaTotal - totalDespesas;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Modal de lançar despesa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-base font-semibold text-gray-700">Lançar Despesa</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <form onSubmit={handleCreateDespesa} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select
                  required
                  value={form.categoria}
                  onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaDespesa })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                >
                  {CATEGORIA_OPTIONS.map((c) => (
                    <option key={c} value={c}>{CATEGORIA_LABEL[c]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <input
                  required
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  placeholder="Ex: Conta de água março"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$) *</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.valor || ''}
                    onChange={(e) => setForm({ ...form, valor: parseFloat(e.target.value) || 0 })}
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                  <input
                    required
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg border border-red-500 hover:bg-white hover:text-red-500 transition disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Lançar Despesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600">Finanças</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 capitalize">{mesLabel}</span>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg border border-red-500 hover:bg-white hover:text-red-500 transition duration-300"
          >
            + Lançar Despesa
          </button>
        </div>
      </div>

      {/* Card lucro líquido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div className={`rounded-xl border border-t-4 border-gray-100 shadow-md p-5 ${lucroLiquido >= 0 ? 'border-t-emerald-500' : 'border-t-red-500'}`}>
          <p className="text-sm text-gray-500 mb-1">Lucro Líquido</p>
          <p className={`text-3xl font-bold ${lucroLiquido >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">receita − despesas do mês</p>
        </div>
        <div className="rounded-xl border border-t-4 border-t-red-400 border-gray-100 shadow-md p-5">
          <p className="text-sm text-gray-500 mb-1">Total de Despesas</p>
          <p className="text-3xl font-bold text-red-500">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">{despesas.length} lançamento{despesas.length !== 1 ? 's' : ''} este mês</p>
        </div>
        <div className="rounded-xl border border-t-4 border-t-emerald-600 border-gray-100 shadow-md p-5">
          <p className="text-sm text-gray-500 mb-1">Receita Bruta</p>
          <p className="text-3xl font-bold text-emerald-600">
            R$ {receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">{concluidosMes.length} atendimento{concluidosMes.length !== 1 ? 's' : ''} concluído{concluidosMes.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-t-4 border-t-emerald-600 border-gray-100 shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Receita total</p>
          <p className="text-3xl font-bold text-emerald-600">
            R$ {receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">{concluidosMes.length} atendimento{concluidosMes.length !== 1 ? 's' : ''} concluído{concluidosMes.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-xl border border-t-4 border-t-green-600 border-gray-100 shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Serviços</p>
          <p className="text-3xl font-bold text-green-600">
            R$ {receitaServicos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">consultas, banho, pet sister</p>
        </div>
        <div className="bg-white rounded-xl border border-t-4 border-t-orange-500 border-gray-100 shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Ticket médio</p>
          <p className="text-3xl font-bold text-orange-600">
            R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">por atendimento concluído</p>
        </div>
        <div className="bg-white rounded-xl border border-t-4 border-t-purple-500 border-gray-100 shadow-md p-6">
          <p className="text-sm text-gray-500 mb-1">Produtos vendidos</p>
          <p className="text-3xl font-bold text-purple-600">
            R$ {receitaMedicamentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {concluidosMes.reduce((s, a) => s + (a.medicamentos ?? []).length, 0)} item{concluidosMes.reduce((s, a) => s + (a.medicamentos ?? []).length, 0) !== 1 ? 'ns' : ''} em {concluidosMes.filter((a) => (a.medicamentos ?? []).length > 0).length} atendimento{concluidosMes.filter((a) => (a.medicamentos ?? []).length > 0).length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Gráficos + Serviços mais utilizados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Donut — Receita por tipo */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-5">Receita por Tipo de Serviço</h2>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <DonutChart
                segments={receitaSegments}
                center={`R$${Math.round(receitaTotal)}`}
              />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {porTipo.map((s) => (
                <div key={s.tipo}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.stroke }} />
                      <span className="text-sm text-gray-600">{s.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      R$ {s.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${receitaTotal > 0 ? Math.round((s.receita / receitaTotal) * 100) : 0}%`, backgroundColor: s.stroke }}
                    />
                  </div>
                </div>
              ))}
              {receitaTotal === 0 && (
                <p className="text-xs text-gray-400 italic">Nenhum atendimento concluído com valor.</p>
              )}
            </div>
          </div>
        </div>

        {/* Donut — Serviços mais utilizados */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-5">Serviços Mais Utilizados</h2>
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <DonutChart
                segments={atendimentosSegments}
                center={`${doMes.length}`}
              />
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {porTipo.map((s, i) => (
                <div key={s.tipo} className={`rounded-xl p-3 ${s.light}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {i === 0 && <span className="text-xs">🥇</span>}
                      {i === 1 && <span className="text-xs">🥈</span>}
                      {i === 2 && <span className="text-xs">🥉</span>}
                      <span className={`text-sm font-semibold ${s.text}`}>{s.label}</span>
                    </div>
                    <span className={`text-lg font-bold ${s.text}`}>{s.pct}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-60 rounded-full h-1.5 mb-1">
                    <div className={`${s.bar} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${s.pct}%` }} />
                  </div>
                  <p className={`text-xs ${s.text} opacity-75`}>
                    {s.count} agendamento{s.count !== 1 ? 's' : ''} · {s.concluidos} concluído{s.concluidos !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de atendimentos concluídos */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold text-gray-700">Atendimentos Concluídos</h2>
          <Link href="/dashboard/agendamentos?filtro=CONCLUIDO" className="text-sm text-green-600 hover:underline">Ver todos</Link>
        </div>

        {historico.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Nenhum atendimento concluído este mês.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Animal</th>
                  <th className="px-4 py-3 font-medium">Tipo</th>
                  <th className="px-4 py-3 font-medium">Descrição</th>
                  <th className="px-4 py-3 font-medium text-right">Serviço</th>
                  <th className="px-4 py-3 font-medium text-right">Medicamentos</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((a) => {
                  const valMeds = (a.medicamentos ?? []).reduce((s, m) => s + m.valor * m.quantidade, 0);
                  const valTotal = (a.valorServico ?? 0) + valMeds;
                  return (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(a.data).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-700">{a.animal.nome}</td>
                      <td className="px-4 py-3 text-gray-600">{TIPO_LABEL[a.tipo]}</td>
                      <td className="px-4 py-3 text-gray-500 max-w-[200px]">
                        {a.descricaoConsulta ? (
                          <span className="text-xs italic">{a.descricaoConsulta}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {a.valorServico != null ? `R$ ${a.valorServico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {valMeds > 0 ? `R$ ${valMeds.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-700">
                        {valTotal > 0 ? `R$ ${valTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 border-t">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-sm font-semibold text-gray-600">Total do mês</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    R$ {receitaServicos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    R$ {receitaMedicamentos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-emerald-700">
                    R$ {receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Despesas do mês */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden mt-6">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold text-gray-700">Despesas do Mês</h2>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-sm text-red-500 border border-red-300 px-3 py-1 rounded-lg hover:bg-red-50 transition"
          >
            + Lançar
          </button>
        </div>

        {despesas.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Nenhuma despesa lançada este mês.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 font-medium">Descrição</th>
                  <th className="px-4 py-3 font-medium text-right">Valor</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {despesas.map((d) => (
                  <tr key={d.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {new Date(d.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-full text-xs font-medium">
                        {CATEGORIA_LABEL[d.categoria]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{d.descricao}</td>
                    <td className="px-4 py-3 text-right font-semibold text-red-500">
                      R$ {d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemoveDespesa(d.id)}
                        className="text-xs text-gray-400 hover:text-red-500 transition"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-gray-600">Total</td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-red-500">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinancasView;
