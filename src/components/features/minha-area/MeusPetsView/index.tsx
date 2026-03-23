'use client';

import { useEffect, useRef, useState } from 'react';
import { animaisApi, vacinasApi, Animal, Vacina } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { calcularIdade } from '@/lib/dateUtils';

interface EditFields {
  dataNascimento: string;
  peso: string;
  comidaFavorita: string;
  brincadeiraFavorita: string;
  curiosidade: string;
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <div className="min-w-0">
        <span className="text-xs text-gray-400">{label}: </span>
        <span className={value ? 'text-gray-700' : 'text-gray-300 italic'}>
          {value ?? 'não informado'}
        </span>
      </div>
    </div>
  );
}

export function MeusPetsView() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [vacinas, setVacinas] = useState<Record<string, Vacina[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<EditFields>({ dataNascimento: '', peso: '', comidaFavorita: '', brincadeiraFavorita: '', curiosidade: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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

  const handleFotoChange = async (animal: Animal, file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(animal.id);
      try {
        const updated = await animaisApi.updateFoto(animal.id, reader.result as string);
        setAnimais((prev) => prev.map((a) => a.id === animal.id ? { ...a, foto: updated.foto } : a));
      } finally {
        setUploading(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const startEdit = (animal: Animal) => {
    setEditing(animal.id);
    setEditFields({
      dataNascimento: animal.dataNascimento ? new Date(animal.dataNascimento).toISOString().split('T')[0] : '',
      peso: animal.peso != null ? String(animal.peso) : '',
      comidaFavorita: animal.comidaFavorita ?? '',
      brincadeiraFavorita: animal.brincadeiraFavorita ?? '',
      curiosidade: animal.curiosidade ?? '',
    });
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    try {
      const updated = await animaisApi.update(id, {
        dataNascimento: editFields.dataNascimento || undefined,
        peso: editFields.peso ? parseFloat(editFields.peso) : undefined,
        comidaFavorita: editFields.comidaFavorita || undefined,
        brincadeiraFavorita: editFields.brincadeiraFavorita || undefined,
        curiosidade: editFields.curiosidade || undefined,
      });
      setAnimais((prev) => prev.map((a) => a.id === id ? { ...a, ...updated } : a));
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-6">Meus Pets</h1>

      {animais.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-md p-10 text-center">
          <p className="text-gray-400 text-sm">Nenhum pet cadastrado. Entre em contato com a clínica.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {animais.map((animal) => (
            <div key={animal.id} className="bg-white rounded-xl border border-gray-100 border-t-4 border-t-green-600 shadow-md overflow-hidden">

              {/* Cabeçalho do card — foto + nome */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div
                  className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-green-200 bg-green-50 flex items-center justify-center flex-shrink-0 cursor-pointer"
                  onClick={() => fileInputRefs.current[animal.id]?.click()}
                  title="Clique para alterar a foto"
                >
                  {uploading === animal.id ? (
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  ) : animal.foto ? (
                    <img src={animal.foto} alt={animal.nome} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-300 text-xs font-medium">Foto</span>
                  )}
                  <input
                    ref={(el) => { fileInputRefs.current[animal.id] = el; }}
                    type="file" accept="image/*" className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) handleFotoChange(animal, e.target.files[0]); }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-lg leading-tight">{animal.nome}</p>
                  <p className="text-sm text-gray-500">{animal.especie}{animal.raca ? ` · ${animal.raca}` : ''}</p>
                </div>
              </div>

              {/* Informações extras */}
              <div className="px-5 pb-4 space-y-2">
                {editing === animal.id ? (
                  /* Modo edição */
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-400 font-medium">Data de nascimento</label>
                      <input
                        type="date"
                        value={editFields.dataNascimento}
                        onChange={(e) => setEditFields((f) => ({ ...f, dataNascimento: e.target.value }))}
                        className="w-full mt-0.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-medium">Peso (kg)</label>
                      <input
                        type="number" min="0" step="0.1"
                        value={editFields.peso}
                        onChange={(e) => setEditFields((f) => ({ ...f, peso: e.target.value }))}
                        placeholder="Ex: 10.5"
                        className="w-full mt-0.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-medium">Comida favorita</label>
                      <input
                        type="text"
                        value={editFields.comidaFavorita}
                        onChange={(e) => setEditFields((f) => ({ ...f, comidaFavorita: e.target.value }))}
                        placeholder="Ex: ração de frango"
                        className="w-full mt-0.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-medium">Brincadeira favorita</label>
                      <input
                        type="text"
                        value={editFields.brincadeiraFavorita}
                        onChange={(e) => setEditFields((f) => ({ ...f, brincadeiraFavorita: e.target.value }))}
                        placeholder="Ex: buscar a bolinha"
                        className="w-full mt-0.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 font-medium">Curiosidade</label>
                      <input
                        type="text"
                        value={editFields.curiosidade}
                        onChange={(e) => setEditFields((f) => ({ ...f, curiosidade: e.target.value }))}
                        placeholder="Ex: tem medo de trovão"
                        className="w-full mt-0.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={() => handleSave(animal.id)} disabled={saving}
                        className="text-xs bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50">
                        {saving ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button type="button" onClick={() => setEditing(null)}
                        className="text-xs border border-gray-300 text-gray-500 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Modo visualização */
                  <div className="space-y-1.5">
                    <InfoRow label="Aniversário" value={animal.dataNascimento ? new Date(animal.dataNascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : null} />
                    <InfoRow label="Idade" value={animal.dataNascimento ? calcularIdade(animal.dataNascimento) : null} />
                    <InfoRow label="Peso" value={animal.peso != null ? `${animal.peso} kg` : null} />
                    <InfoRow label="Comida favorita" value={animal.comidaFavorita} />
                    <InfoRow label="Brincadeira favorita" value={animal.brincadeiraFavorita} />
                    <InfoRow label="Curiosidade" value={animal.curiosidade} />
                    <button type="button" onClick={() => startEdit(animal)}
                      className="mt-2 text-xs text-green-600 border border-green-200 px-3 py-1 rounded-lg hover:bg-green-50 transition">
                      Editar informações
                    </button>
                  </div>
                )}
              </div>

              {/* Vacinas expandíveis */}
              <div className="border-t">
                <button
                  type="button"
                  onClick={() => toggleAnimal(animal.id)}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm text-gray-600 hover:bg-gray-50 transition"
                >
                  <span className="font-medium">Histórico de Vacinas</span>
                  <span className="text-green-600">{expanded === animal.id ? '▲' : '▼'}</span>
                </button>

                {expanded === animal.id && (
                  <div className="px-5 pb-4 bg-gray-50">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeusPetsView;
