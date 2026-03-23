'use client';

import { useEffect, useState } from 'react';
import { vacinasApi, animaisApi, Vacina, Animal } from '@/lib/api';

interface VacinaComAnimal extends Vacina {
  animal: Animal;
}

function diasParaVencer(data: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.round((new Date(data).getTime() - hoje.getTime()) / 86400000);
}

function statusVacina(proximaDose: string | null): 'vencida' | 'urgente' | 'ok' | 'sem-dose' {
  if (!proximaDose) return 'sem-dose';
  const dias = diasParaVencer(proximaDose);
  if (dias < 0) return 'vencida';
  if (dias <= 30) return 'urgente';
  return 'ok';
}

const statusConfig = {
  vencida: { label: 'Vencida', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-600', dot: 'bg-red-500' },
  urgente: { label: 'Atenção', bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-600', dot: 'bg-orange-400' },
  ok: { label: 'Em dia', bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-600', dot: 'bg-green-500' },
  'sem-dose': { label: 'Sem agendamento', bg: 'bg-gray-50', border: 'border-gray-100', badge: 'bg-gray-100 text-gray-500', dot: 'bg-gray-300' },
};

export default function VacinasPage() {
  const [vacinas, setVacinas] = useState<VacinaComAnimal[]>([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroPet, setFiltroPet] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');

  useEffect(() => {
    animaisApi.list().then(async (pets) => {
      setAnimais(pets);
      const todas: VacinaComAnimal[] = [];
      for (const pet of pets) {
        const vs = await vacinasApi.listByAnimal(pet.id);
        vs.forEach((v) => todas.push({ ...v, animal: pet }));
      }
      // Ordena: vencidas → urgentes → em dia → sem dose; dentro de cada grupo, por data de aplicação desc
      todas.sort((a, b) => {
        const ordemStatus = { vencida: 0, urgente: 1, ok: 2, 'sem-dose': 3 };
        const sa = statusVacina(a.proximaDose);
        const sb = statusVacina(b.proximaDose);
        if (sa !== sb) return ordemStatus[sa] - ordemStatus[sb];
        return b.dataAplicacao.localeCompare(a.dataAplicacao);
      });
      setVacinas(todas);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtradas = vacinas.filter((v) => {
    const okPet = filtroPet ? v.animal.id === filtroPet : true;
    const okStatus = filtroStatus ? statusVacina(v.proximaDose) === filtroStatus : true;
    return okPet && okStatus;
  });

  const counts = {
    vencida: vacinas.filter((v) => statusVacina(v.proximaDose) === 'vencida').length,
    urgente: vacinas.filter((v) => statusVacina(v.proximaDose) === 'urgente').length,
    ok: vacinas.filter((v) => statusVacina(v.proximaDose) === 'ok').length,
    'sem-dose': vacinas.filter((v) => statusVacina(v.proximaDose) === 'sem-dose').length,
  };

  // Agrupa por pet
  const porPet = animais
    .map((a) => ({
      animal: a,
      vacinas: filtradas.filter((v) => v.animal.id === a.id),
    }))
    .filter((g) => g.vacinas.length > 0);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vacinas</h1>
        <p className="text-sm text-gray-500 mt-1">Histórico e status de vacinação dos seus pets.</p>
      </div>

      {/* Resumo de status */}
      {vacinas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {([
            { key: 'vencida', label: 'Vencidas', color: 'text-red-500', top: 'border-t-red-500' },
            { key: 'urgente', label: 'Atenção', color: 'text-orange-500', top: 'border-t-orange-400' },
            { key: 'ok', label: 'Em dia', color: 'text-green-600', top: 'border-t-green-600' },
            { key: 'sem-dose', label: 'Sem data', color: 'text-gray-400', top: 'border-t-gray-300' },
          ] as const).map(({ key, label, color, top }) => (
            <button
              key={key}
              onClick={() => setFiltroStatus((f) => f === key ? '' : key)}
              className={`bg-white rounded-xl border border-t-4 ${top} border-gray-100 shadow-md p-4 text-left transition hover:shadow-lg ${filtroStatus === key ? 'ring-2 ring-offset-1 ring-green-400' : ''}`}
            >
              <p className={`text-2xl font-bold ${color}`}>{counts[key]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </button>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
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

        {filtroStatus && (
          <button
            onClick={() => setFiltroStatus('')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-500 hover:bg-gray-50 flex items-center gap-1.5 transition"
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig[filtroStatus as keyof typeof statusConfig].dot}`} />
            {statusConfig[filtroStatus as keyof typeof statusConfig].label}
            <span className="text-gray-300 ml-1">✕</span>
          </button>
        )}
      </div>

      {/* Lista agrupada por pet */}
      {porPet.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-10 text-center">
          <p className="text-3xl mb-3">💉</p>
          <p className="text-gray-500 text-sm">Nenhuma vacina registrada.</p>
          <p className="text-gray-400 text-xs mt-1">Entre em contato com a clínica para registrar o histórico de vacinação.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {porPet.map(({ animal, vacinas: vs }) => (
            <div key={animal.id}>
              {/* Pet header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-200 bg-green-50 flex-shrink-0">
                  {animal.foto ? (
                    <img src={animal.foto} alt={animal.nome} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-base">🐾</div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{animal.nome}</p>
                  <p className="text-xs text-gray-400">{animal.especie}{animal.raca ? ` · ${animal.raca}` : ''}</p>
                </div>
                <span className="ml-auto text-xs text-gray-400">{vs.length} vacina{vs.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Vacinas do pet */}
              <div className="flex flex-col gap-2">
                {vs.map((v) => {
                  const st = statusVacina(v.proximaDose);
                  const cfg = statusConfig[st];
                  const dias = v.proximaDose ? diasParaVencer(v.proximaDose) : null;

                  return (
                    <div key={v.id} className={`flex items-start justify-between rounded-xl px-4 py-3 border ${cfg.bg} ${cfg.border}`}>
                      <div className="flex items-start gap-3">
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{v.nome}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Aplicada em {new Date(v.dataAplicacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </p>
                          {v.proximaDose && (
                            <p className="text-xs mt-0.5 text-gray-500">
                              Próxima dose:{' '}
                              <span className={dias !== null && dias < 0 ? 'text-red-500 font-medium' : dias !== null && dias <= 30 ? 'text-orange-500 font-medium' : 'text-gray-600'}>
                                {new Date(v.proximaDose).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                {dias !== null && dias < 0 && ` (venceu há ${Math.abs(dias)} dia${Math.abs(dias) !== 1 ? 's' : ''})`}
                                {dias !== null && dias === 0 && ' (hoje)'}
                                {dias !== null && dias > 0 && dias <= 30 && ` (em ${dias} dia${dias !== 1 ? 's' : ''})`}
                              </span>
                            </p>
                          )}
                          {v.observacoes && (
                            <p className="text-xs text-gray-400 mt-1 italic">{v.observacoes}</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ml-3 ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
