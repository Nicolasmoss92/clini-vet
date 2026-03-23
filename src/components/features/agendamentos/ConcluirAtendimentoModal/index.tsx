'use client';

import { useState } from 'react';
import { agendamentosApi, Agendamento } from '@/lib/api';

interface MedicamentoRow {
  nome: string;
  valor: string;
  quantidade: string;
}

export interface ConcluirAtendimentoModalProps {
  agendamentoId: string;
  onClose: () => void;
  onSuccess: (updated: Agendamento) => void;
}

export function ConcluirAtendimentoModal({ agendamentoId, onClose, onSuccess }: ConcluirAtendimentoModalProps) {
  const [descricaoConsulta, setDescricaoConsulta] = useState('');
  const [valorServico, setValorServico] = useState('');
  const [medicamentos, setMedicamentos] = useState<MedicamentoRow[]>([]);
  const [updating, setUpdating] = useState(false);

  const addMed = () =>
    setMedicamentos((m) => [...m, { nome: '', valor: '', quantidade: '1' }]);

  const removeMed = (i: number) =>
    setMedicamentos((m) => m.filter((_, idx) => idx !== i));

  const updateMed = (i: number, field: keyof MedicamentoRow, value: string) =>
    setMedicamentos((m) => m.map((med, idx) => idx === i ? { ...med, [field]: value } : med));

  const handleConcluir = async () => {
    setUpdating(true);
    try {
      const meds = medicamentos
        .filter((m) => m.nome.trim())
        .map((m) => ({
          nome: m.nome.trim(),
          valor: parseFloat(m.valor) || 0,
          quantidade: parseInt(m.quantidade) || 1,
        }));

      const updated = await agendamentosApi.updateStatus(agendamentoId, 'CONCLUIDO', {
        descricaoConsulta: descricaoConsulta || undefined,
        valorServico: valorServico ? parseFloat(valorServico) : undefined,
        medicamentos: meds.length ? meds : undefined,
      });

      onSuccess(updated);
    } finally {
      setUpdating(false);
    }
  };

  return (
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
              value={descricaoConsulta}
              onChange={(e) => setDescricaoConsulta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor do serviço (R$)</label>
            <input
              type="number" min="0" step="0.01"
              placeholder="0,00"
              value={valorServico}
              onChange={(e) => setValorServico(e.target.value)}
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

            {medicamentos.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Nenhum medicamento adicionado.</p>
            ) : (
              <div className="space-y-2">
                {medicamentos.map((med, i) => (
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
          {(valorServico || medicamentos.some((m) => m.nome && m.valor)) && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Serviço</span>
                <span>R$ {parseFloat(valorServico || '0').toFixed(2)}</span>
              </div>
              {medicamentos.filter((m) => m.nome && m.valor).map((m, i) => (
                <div key={i} className="flex justify-between text-gray-600 mb-1">
                  <span>{m.nome} × {m.quantidade || 1}</span>
                  <span>R$ {(parseFloat(m.valor || '0') * (parseInt(m.quantidade) || 1)).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold text-green-700 border-t border-green-200 pt-2 mt-2">
                <span>Total</span>
                <span>R$ {(
                  parseFloat(valorServico || '0') +
                  medicamentos.reduce((sum, m) => sum + (parseFloat(m.valor || '0') * (parseInt(m.quantidade) || 1)), 0)
                ).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button type="button" onClick={handleConcluir} disabled={updating}
            className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition disabled:opacity-50">
            {updating ? 'Salvando...' : 'Concluir Atendimento'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConcluirAtendimentoModal;
