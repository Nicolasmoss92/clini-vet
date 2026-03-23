'use client';

import { Agendamento } from '@/lib/api';
import StatusBadge from '@/components/ui/StatusBadge';
import { TIPO_LABEL } from '@/lib/constants';

interface AgendamentoCardProps {
  agendamento: Agendamento;
  foto: string | null;
  isExpanded: boolean;
  onToggle: () => void;
  onCancel: (id: string) => void;
  canceling: string | null;
}

export function AgendamentoCard({ agendamento: a, foto, isExpanded, onToggle, onCancel, canceling }: AgendamentoCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
      {/* Cabeçalho */}
      <button
        type="button"
        onClick={onToggle}
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
              <p className="font-medium text-gray-700">{a.horaInicio}{a.horaFim ? ` até ${a.horaFim}` : ''}</p>
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

          {/* Resumo do Atendimento — só para concluídos */}
          {a.status === 'CONCLUIDO' && (a.descricaoConsulta || a.valorServico != null || (a.medicamentos?.length ?? 0) > 0) && (
            <div className="border border-green-200 rounded-xl overflow-hidden">
              <div className="bg-green-600 px-4 py-2">
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
                          <span className="text-gray-700 font-medium">
                            {m.nome} <span className="font-normal text-gray-400">× {m.quantidade}</span>
                          </span>
                          <span className="text-gray-600">
                            R$ {(m.valor * m.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
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
              onClick={() => onCancel(a.id)}
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
}
