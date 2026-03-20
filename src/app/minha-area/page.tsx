'use client';

import { useEffect, useState } from 'react';
import { animaisApi, vacinasApi, Animal, Vacina } from '@/lib/api';

export default function MinhAreaPage() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [vacinas, setVacinas] = useState<Record<string, Vacina[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animaisApi.list().then(setAnimais).finally(() => setLoading(false));
  }, []);

  const toggleAnimal = async (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!vacinas[id]) {
      const v = await vacinasApi.listByAnimal(id);
      setVacinas((prev) => ({ ...prev, [id]: v }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Meus Pets</h1>

      {animais.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-10 text-center">
          <p className="text-gray-400 text-sm">Nenhum pet cadastrado. Entre em contato com a clínica.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {animais.map((animal) => (
            <div key={animal.id} className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md overflow-hidden">
              <button
                onClick={() => toggleAnimal(animal.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold text-gray-700">{animal.nome}</p>
                  <p className="text-sm text-gray-500">{animal.especie}{animal.raca ? ` · ${animal.raca}` : ''}</p>
                </div>
                <span className="text-green-600 text-lg">{expanded === animal.id ? '▲' : '▼'}</span>
              </button>

              {expanded === animal.id && (
                <div className="border-t px-6 py-4 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Histórico de Vacinas</h3>
                  {(vacinas[animal.id] ?? []).length === 0 ? (
                    <p className="text-xs text-gray-400">Nenhuma vacina registrada.</p>
                  ) : (
                    <ul className="space-y-2">
                      {vacinas[animal.id].map((v) => (
                        <li key={v.id} className="flex items-center justify-between text-xs text-gray-600 bg-white rounded-lg px-4 py-2 border border-gray-100">
                          <span className="font-medium">{v.nome}</span>
                          <span>Aplicada: {new Date(v.dataAplicacao).toLocaleDateString('pt-BR')}</span>
                          {v.proximaDose && (
                            <span className="text-green-600">Próx: {new Date(v.proximaDose).toLocaleDateString('pt-BR')}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
