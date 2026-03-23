'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, animaisApi, Agendamento, Animal } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const tipoLabel: Record<string, string> = {
  CONSULTA: 'Consulta',
  BANHO_TOSA: 'Banho e Tosa',
  PETSITTER: 'Pet Sitter',
};

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcTotal(ag: Agendamento): number {
  const servico = ag.valorServico ?? 0;
  const meds = ag.medicamentos.reduce((acc, m) => acc + m.valor * m.quantidade, 0);
  return servico + meds;
}

export default function HistoricoFinanceiroPage() {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filtroMes, setFiltroMes] = useState<string>('');
  const [filtroPet, setFiltroPet] = useState<string>('');

  useEffect(() => {
    Promise.all([agendamentosApi.list(), animaisApi.list()])
      .then(([ags, pets]) => {
        setAgendamentos(ags.filter((a) => a.status === 'CONCLUIDO'));
        setAnimais(pets);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Meses disponíveis
  const mesesDisponiveis = Array.from(
    new Set(agendamentos.map((a) => a.data.slice(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  // Mês padrão: mês atual se existir, senão o mais recente
  const mesAtual = new Date().toISOString().slice(0, 7);
  const mesSelecionado = filtroMes || (mesesDisponiveis.includes(mesAtual) ? mesAtual : mesesDisponiveis[0] ?? '');

  // Filtragem
  const concluidos = agendamentos
    .filter((a) => {
      const okMes = mesSelecionado ? a.data.slice(0, 7) === mesSelecionado : true;
      const okPet = filtroPet ? a.animalId === filtroPet : true;
      return okMes && okPet;
    })
    .sort((a, b) => b.data.localeCompare(a.data) || b.horaInicio.localeCompare(a.horaInicio));

  // Totais
  const totalMes = concluidos.reduce((acc, a) => acc + calcTotal(a), 0);
  const totalAcumulado = agendamentos
    .filter((a) => (filtroPet ? a.animalId === filtroPet : true))
    .reduce((acc, a) => acc + calcTotal(a), 0);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function formatMesLabel(ym: string) {
    const [year, month] = ym.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Histórico Financeiro</h1>
        <p className="text-sm text-gray-500 mt-1">Extrato de todos os atendimentos concluídos.</p>
      </div>

      {/* Totais */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-t-4 border-t-green-600 border-gray-100 shadow-md p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Total {mesSelecionado ? `em ${formatMesLabel(mesSelecionado)}` : 'filtrado'}
          </p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalMes)}</p>
          <p className="text-xs text-gray-400 mt-1">{concluidos.length} atendimento{concluidos.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-white rounded-xl border border-t-4 border-t-gray-300 border-gray-100 shadow-md p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total acumulado</p>
          <p className="text-2xl font-bold text-gray-700">{formatCurrency(totalAcumulado)}</p>
          <p className="text-xs text-gray-400 mt-1">{agendamentos.filter((a) => filtroPet ? a.animalId === filtroPet : true).length} atendimento{agendamentos.length !== 1 ? 's' : ''} no total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={mesSelecionado}
          onChange={(e) => setFiltroMes(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {mesesDisponiveis.map((m) => (
            <option key={m} value={m}>{formatMesLabel(m)}</option>
          ))}
          {mesesDisponiveis.length === 0 && <option value="">Todos os meses</option>}
        </select>

        <select
          value={filtroPet}
          onChange={(e) => setFiltroPet(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos os pets</option>
          {animais.map((a) => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>
      </div>

      {/* Lista de recibos */}
      {concluidos.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-10 text-center">
          <p className="text-3xl mb-3">🧾</p>
          <p className="text-gray-500 text-sm">Nenhum atendimento concluído neste período.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {concluidos.map((ag) => {
            const isOpen = expanded.has(ag.id);
            const total = calcTotal(ag);
            const temDetalhes = ag.descricaoConsulta || ag.valorServico || ag.medicamentos.length > 0;

            return (
              <div key={ag.id} className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
                {/* Cabeçalho do recibo */}
                <button
                  onClick={() => temDetalhes && toggleExpand(ag.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition ${temDetalhes ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-10 h-10 bg-green-50 rounded-lg flex-shrink-0">
                      <p className="text-xs font-bold text-green-700 leading-none">
                        {new Date(ag.data).toLocaleDateString('pt-BR', { day: '2-digit' })}
                      </p>
                      <p className="text-[10px] text-green-500 uppercase leading-none mt-0.5">
                        {new Date(ag.data).toLocaleDateString('pt-BR', { month: 'short' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{ag.animal.nome}</p>
                      <p className="text-xs text-gray-500">{tipoLabel[ag.tipo]} · {ag.horaInicio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-base font-bold text-gray-800">{formatCurrency(total)}</p>
                    {temDetalhes && (
                      <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                  </div>
                </button>

                {/* Detalhes expandidos */}
                {isOpen && temDetalhes && (
                  <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                    {ag.descricaoConsulta && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Descrição</p>
                        <p className="text-sm text-gray-700">{ag.descricaoConsulta}</p>
                      </div>
                    )}

                    {/* Linha de serviço */}
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Detalhamento</p>
                      <div className="flex flex-col gap-1.5">
                        {ag.valorServico != null && ag.valorServico > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{tipoLabel[ag.tipo]}</span>
                            <span className="font-medium text-gray-800">{formatCurrency(ag.valorServico)}</span>
                          </div>
                        )}
                        {ag.medicamentos.map((m) => (
                          <div key={m.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {m.nome}
                              {m.quantidade > 1 && (
                                <span className="text-gray-400 ml-1">× {m.quantidade}</span>
                              )}
                            </span>
                            <span className="font-medium text-gray-800">{formatCurrency(m.valor * m.quantidade)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-3">
                      <span className="text-sm font-semibold text-gray-700">Total</span>
                      <span className="text-base font-bold text-green-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
