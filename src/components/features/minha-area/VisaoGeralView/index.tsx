'use client';

import { useEffect, useState } from 'react';
import { animaisApi, agendamentosApi, vacinasApi, Animal, Agendamento, Vacina } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { TIPO_LABEL, STATUS_COLOR } from '@/lib/constants';
import { diasAteAniversario, idadeAnos, diasParaVencer } from '@/lib/dateUtils';

interface VacinaComAnimal extends Vacina {
  animalNome: string;
  animalId: string;
}

export function VisaoGeralView() {
  const { user } = useAuth();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [vacinas, setVacinas] = useState<VacinaComAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [agIdx, setAgIdx] = useState(0);
  const [aniIdx, setAniIdx] = useState(0);

  useEffect(() => {
    Promise.all([animaisApi.list(), agendamentosApi.list()])
      .then(async ([pets, ags]) => {
        setAnimais(pets);
        setAgendamentos(ags);

        // Carrega vacinas de todos os pets
        const todasVacinas: VacinaComAnimal[] = [];
        for (const pet of pets) {
          const vs = await vacinasApi.listByAnimal(pet.id);
          vs.forEach((v) => todasVacinas.push({ ...v, animalNome: pet.nome, animalId: pet.id }));
        }
        setVacinas(todasVacinas);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const hojeISO = hoje.toISOString().split('T')[0];

  // Próximos agendamentos ativos (todos, para carrossel)
  const proximosAgs = agendamentos
    .filter((a) => a.data.split('T')[0] >= hojeISO && (a.status === 'AGENDADO' || a.status === 'CONFIRMADO'))
    .sort((a, b) => a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio));
  const proximoAg = proximosAgs[agIdx] ?? null;

  // Pendentes (aguardando aprovação)
  const pendentes = agendamentos.filter((a) => a.status === 'AGENDADO');

  // Aniversários — todos ordenados pelo mais próximo
  const aniversarios = animais
    .filter((a) => a.dataNascimento)
    .map((a) => ({ ...a, dias: diasAteAniversario(a.dataNascimento!) }))
    .sort((a, b) => a.dias - b.dias);

  const aniversariosProximos = aniversarios.filter((a) => a.dias <= 30);

  // Vacinas: vencidas, a vencer em 30 dias, em dia
  const vacinasComStatus = vacinas
    .filter((v) => v.proximaDose)
    .map((v) => ({ ...v, diasRestantes: diasParaVencer(v.proximaDose!) }))
    .sort((a, b) => a.diasRestantes - b.diasRestantes);

  const vacinasVencidas = vacinasComStatus.filter((v) => v.diasRestantes < 0);
  const vacinasUrgentes = vacinasComStatus.filter((v) => v.diasRestantes >= 0 && v.diasRestantes <= 30);
  const vacinasOk = vacinasComStatus.filter((v) => v.diasRestantes > 30);
  const semProxDose = vacinas.filter((v) => !v.proximaDose);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Saudação */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Olá, {user?.nome?.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Aqui está um resumo do que está acontecendo com seus pets.</p>
      </div>

      {/* Cards de status rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Próximo agendamento */}
        <div className="bg-white rounded-xl border border-t-4 border-t-green-600 border-gray-100 shadow-md p-5 min-h-[160px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Próximo agendamento</p>
            {proximosAgs.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAgIdx((i) => Math.max(0, i - 1))}
                  disabled={agIdx === 0}
                  className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600 disabled:opacity-30 transition text-sm"
                >‹</button>
                <span className="text-xs text-gray-400">{agIdx + 1}/{proximosAgs.length}</span>
                <button
                  onClick={() => setAgIdx((i) => Math.min(proximosAgs.length - 1, i + 1))}
                  disabled={agIdx === proximosAgs.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600 disabled:opacity-30 transition text-sm"
                >›</button>
              </div>
            )}
          </div>
          {proximoAg ? (
            <Link href="/minha-area/agendamentos" className="flex-1">
              <p className="font-bold text-gray-800 text-sm">{proximoAg.animal.nome}</p>
              <p className="text-green-600 font-semibold text-sm mt-0.5">{TIPO_LABEL[proximoAg.tipo]}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(proximoAg.data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} · {proximoAg.horaInicio}
              </p>
              <span className={`mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[proximoAg.status]}`}>
                {proximoAg.status === 'CONFIRMADO' ? 'Confirmado' : 'Aguardando'}
              </span>
            </Link>
          ) : (
            <p className="text-sm text-gray-400 italic mt-1">Nenhum agendamento futuro</p>
          )}
        </div>

        {/* Pendentes */}
        <Link href="/minha-area/agendamentos" className="min-h-[160px]">
          <div className="bg-white rounded-xl border border-t-4 border-t-yellow-400 border-gray-100 shadow-md p-5 h-full flex flex-col hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Aguardando aprovação</p>
            <p className="text-3xl font-bold text-yellow-500">{pendentes.length}</p>
            <p className="text-xs text-gray-400 mt-1">
              {pendentes.length === 0
                ? 'Tudo certo por aqui'
                : `agendamento${pendentes.length > 1 ? 's' : ''} pendente${pendentes.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </Link>

        {/* Aniversário */}
        <div className={`bg-white rounded-xl border border-t-4 border-gray-100 shadow-md p-5 min-h-[160px] flex flex-col ${
          aniversarios[aniIdx]?.dias === 0 ? 'border-t-yellow-400' : 'border-t-pink-400'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Aniversário</p>
            {aniversarios.length > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAniIdx((i) => Math.max(0, i - 1))}
                  disabled={aniIdx === 0}
                  className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-pink-400 hover:text-pink-500 disabled:opacity-30 transition text-sm"
                >‹</button>
                <span className="text-xs text-gray-400">{aniIdx + 1}/{aniversarios.length}</span>
                <button
                  onClick={() => setAniIdx((i) => Math.min(aniversarios.length - 1, i + 1))}
                  disabled={aniIdx === aniversarios.length - 1}
                  className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-pink-400 hover:text-pink-500 disabled:opacity-30 transition text-sm"
                >›</button>
              </div>
            )}
          </div>
          {aniversarios[aniIdx] ? (
            <Link href="/minha-area" className="flex-1 flex items-start gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-200 bg-pink-50 flex-shrink-0">
                {aniversarios[aniIdx].foto ? (
                  <img src={aniversarios[aniIdx].foto!} alt={aniversarios[aniIdx].nome} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🐾</div>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{aniversarios[aniIdx].nome}</p>
                <p className={`text-sm font-semibold mt-0.5 ${aniversarios[aniIdx].dias === 0 ? 'text-yellow-500' : 'text-pink-500'}`}>
                  {aniversarios[aniIdx].dias === 0 ? '🎂 Hoje!' : aniversarios[aniIdx].dias === 1 ? '🎉 Amanhã!' : `em ${aniversarios[aniIdx].dias} dias`}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(aniversarios[aniIdx].dataNascimento!).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                </p>
              </div>
            </Link>
          ) : (
            <p className="text-sm text-gray-400 italic mt-1">Sem data de nascimento</p>
          )}
        </div>
      </div>

      {/* Aniversários próximos */}
      {aniversariosProximos.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">🎂 Aniversários</h2>
          <div className="flex flex-col gap-3">
            {aniversariosProximos.map((a) => {
              const anos = idadeAnos(a.dataNascimento!);
              const isHoje = a.dias === 0;
              return (
                <div key={a.id} className={`flex items-center justify-between rounded-xl px-4 py-3 border ${isHoje ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-200 bg-green-50 flex-shrink-0">
                      {a.foto ? (
                        <img src={a.foto} alt={a.nome} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">🐾</div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{a.nome}</p>
                      <p className="text-xs text-gray-500">
                        {isHoje ? `Faz ${anos + 1} anos hoje!` : `Faz ${anos + 1} anos em ${a.dias} dia${a.dias > 1 ? 's' : ''}`}
                      </p>
                    </div>
                  </div>
                  {isHoje && (
                    <span className="text-xl">🥳</span>
                  )}
                  {!isHoje && (
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {a.dias === 1 ? 'amanhã' : `em ${a.dias} dias`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status das vacinas */}
      {vacinas.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">💉 Status das Vacinas</h2>
          <div className="flex flex-col gap-2">
            {vacinasVencidas.map((v) => (
              <div key={v.id} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-red-700">{v.nome} <span className="font-normal text-red-500">· {v.animalNome}</span></p>
                  <p className="text-xs text-red-400 mt-0.5">
                    Venceu há {Math.abs(v.diasRestantes)} dia{Math.abs(v.diasRestantes) > 1 ? 's' : ''} — {new Date(v.proximaDose!).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">Vencida</span>
              </div>
            ))}
            {vacinasUrgentes.map((v) => (
              <div key={v.id} className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-orange-700">{v.nome} <span className="font-normal text-orange-500">· {v.animalNome}</span></p>
                  <p className="text-xs text-orange-400 mt-0.5">
                    Vence em {v.diasRestantes} dia{v.diasRestantes > 1 ? 's' : ''} — {new Date(v.proximaDose!).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">Atenção</span>
              </div>
            ))}
            {vacinasOk.map((v) => (
              <div key={v.id} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-green-700">{v.nome} <span className="font-normal text-green-500">· {v.animalNome}</span></p>
                  <p className="text-xs text-green-400 mt-0.5">
                    Próxima dose em {v.diasRestantes} dias — {new Date(v.proximaDose!).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Em dia</span>
              </div>
            ))}
            {semProxDose.map((v) => (
              <div key={v.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">{v.nome} <span className="font-normal text-gray-400">· {v.animalNome}</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">Sem próxima dose agendada</p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">—</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Próximos agendamentos */}
      {agendamentos.filter((a) => a.data.split('T')[0] >= hojeISO && a.status !== 'CANCELADO').length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-700">📅 Próximos Agendamentos</h2>
            <Link href="/minha-area/agendamentos" className="text-sm text-green-600 hover:underline">Ver todos</Link>
          </div>
          <div className="flex flex-col gap-2">
            {agendamentos
              .filter((a) => a.data.split('T')[0] >= hojeISO && a.status !== 'CANCELADO' && a.status !== 'CONCLUIDO')
              .sort((a, b) => a.data.localeCompare(b.data) || a.horaInicio.localeCompare(b.horaInicio))
              .slice(0, 4)
              .map((a) => (
                <div key={a.id} className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-green-200 bg-green-50 flex-shrink-0 flex items-center justify-center text-sm">
                      🐾
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{a.animal.nome}</p>
                      <p className="text-xs text-gray-500">
                        {TIPO_LABEL[a.tipo]} · {new Date(a.data).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} · {a.horaInicio}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[a.status]}`}>
                    {a.status === 'CONFIRMADO' ? 'Confirmado' : 'Pendente'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {animais.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-10 text-center">
          <p className="text-4xl mb-3">🐾</p>
          <p className="text-gray-500 text-sm">Nenhum pet cadastrado ainda.</p>
          <p className="text-gray-400 text-xs mt-1">Entre em contato com a clínica para cadastrar seus pets.</p>
        </div>
      )}
    </div>
  );
}

export default VisaoGeralView;
