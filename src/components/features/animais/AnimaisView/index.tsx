'use client';

import { useEffect, useState } from 'react';
import { animaisApi, usersApi, vacinasApi, Animal, User, Vacina, CreateAnimalData, CreateVacinaData } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';

interface EditAnimalFields {
  nome: string;
  especie: string;
  raca: string;
  dataNascimento: string;
  peso: string;
  comidaFavorita: string;
  brincadeiraFavorita: string;
  curiosidade: string;
}

interface EditVacinaFields {
  nome: string;
  dataAplicacao: string;
  proximaDose: string;
  observacoes: string;
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="text-sm">
      <span className="text-xs text-gray-400">{label}: </span>
      <span className={value ? 'text-gray-700' : 'text-gray-300 italic'}>{value ?? 'não informado'}</span>
    </div>
  );
}

export function AnimaisView() {
  const { showToast } = useToast();
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [tutores, setTutores] = useState<User[]>([]);
  const [vacinas, setVacinas] = useState<Record<string, Vacina[]>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditAnimalFields>({ nome: '', especie: '', raca: '', dataNascimento: '', peso: '', comidaFavorita: '', brincadeiraFavorita: '', curiosidade: '' });
  const [form, setForm] = useState<CreateAnimalData>({ nome: '', especie: '', raca: '', tutorId: '' });
  const [vacinaForm, setVacinaForm] = useState<CreateVacinaData>({ animalId: '', nome: '', dataAplicacao: '' });
  const [editingVacina, setEditingVacina] = useState<string | null>(null);
  const [showVacinaFormFor, setShowVacinaFormFor] = useState<string | null>(null);
  const [editVacinaForm, setEditVacinaForm] = useState<EditVacinaFields>({ nome: '', dataAplicacao: '', proximaDose: '', observacoes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([animaisApi.list(), usersApi.list()])
      .then(([a, u]) => {
        setAnimais(a);
        setTutores(u.filter((u) => u.role === 'TUTOR'));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExpand = async (animalId: string) => {
    if (expanded === animalId) { setExpanded(null); return; }
    setExpanded(animalId);
    if (!vacinas[animalId]) {
      const v = await vacinasApi.listByAnimal(animalId);
      setVacinas((prev) => ({ ...prev, [animalId]: v }));
    }
    setVacinaForm({ animalId, nome: '', dataAplicacao: '' });
  };

  const startEdit = (animal: Animal) => {
    setEditing(animal.id);
    setEditForm({
      nome: animal.nome,
      especie: animal.especie,
      raca: animal.raca ?? '',
      dataNascimento: animal.dataNascimento ? new Date(animal.dataNascimento).toISOString().split('T')[0] : '',
      peso: animal.peso != null ? String(animal.peso) : '',
      comidaFavorita: animal.comidaFavorita ?? '',
      brincadeiraFavorita: animal.brincadeiraFavorita ?? '',
      curiosidade: animal.curiosidade ?? '',
    });
  };

  const handleCreateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const novo = await animaisApi.create(form);
      setAnimais((prev) => [...prev, novo]);
      setShowForm(false);
      setForm({ nome: '', especie: '', raca: '', tutorId: '' });
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Erro ao cadastrar animal.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAnimal = async (id: string) => {
    setSaving(true);
    try {
      const updated = await animaisApi.update(id, {
        dataNascimento: editForm.dataNascimento || undefined,
        peso: editForm.peso ? parseFloat(editForm.peso) : undefined,
        comidaFavorita: editForm.comidaFavorita || undefined,
        brincadeiraFavorita: editForm.brincadeiraFavorita || undefined,
        curiosidade: editForm.curiosidade || undefined,
      });
      setAnimais((prev) => prev.map((a) => a.id === id ? { ...a, ...updated } : a));
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateVacina = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const nova = await vacinasApi.create(vacinaForm);
      setVacinas((prev) => ({ ...prev, [vacinaForm.animalId]: [...(prev[vacinaForm.animalId] ?? []), nova] }));
      setVacinaForm((f) => ({ ...f, nome: '', dataAplicacao: '', proximaDose: '', observacoes: '' }));
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Erro ao registrar vacina.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAnimal = async (id: string) => {
    if (!confirm('Remover este animal?')) return;
    await animaisApi.delete(id);
    setAnimais((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDeleteVacina = async (vacinaId: string, animalId: string) => {
    if (!confirm('Remover esta vacina?')) return;
    await vacinasApi.delete(vacinaId);
    setVacinas((prev) => ({ ...prev, [animalId]: prev[animalId].filter((v) => v.id !== vacinaId) }));
  };

  const startEditVacina = (v: Vacina) => {
    setEditingVacina(v.id);
    setEditVacinaForm({
      nome: v.nome,
      dataAplicacao: v.dataAplicacao.split('T')[0],
      proximaDose: v.proximaDose ? v.proximaDose.split('T')[0] : '',
      observacoes: v.observacoes ?? '',
    });
  };

  const handleUpdateVacina = async (vacinaId: string, animalId: string) => {
    setSaving(true);
    try {
      const updated = await vacinasApi.update(vacinaId, {
        nome: editVacinaForm.nome || undefined,
        dataAplicacao: editVacinaForm.dataAplicacao || undefined,
        proximaDose: editVacinaForm.proximaDose || undefined,
        observacoes: editVacinaForm.observacoes || undefined,
      });
      setVacinas((prev) => ({ ...prev, [animalId]: prev[animalId].map((v) => v.id === vacinaId ? { ...v, ...updated } : v) }));
      setEditingVacina(null);
    } finally {
      setSaving(false);
    }
  };

  const calcularIdade = (dataNascimento: string): string => {
    const nasc = new Date(dataNascimento);
    const hoje = new Date();
    const totalMeses = (hoje.getFullYear() - nasc.getFullYear()) * 12 + (hoje.getMonth() - nasc.getMonth()) - (hoje.getDate() < nasc.getDate() ? 1 : 0);
    if (totalMeses < 1) return 'menos de 1 mês';
    if (totalMeses < 12) return `${totalMeses} ${totalMeses === 1 ? 'mês' : 'meses'}`;
    const a = Math.floor(totalMeses / 12);
    const m = totalMeses % 12;
    return m === 0 ? `${a} ${a === 1 ? 'ano' : 'anos'}` : `${a} ${a === 1 ? 'ano' : 'anos'} e ${m} ${m === 1 ? 'mês' : 'meses'}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600">Animais</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300"
        >
          {showForm ? 'Cancelar' : '+ Novo Animal'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateAnimal} className="bg-white rounded-xl border border-gray-100 shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Cadastrar Animal</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Espécie *</label>
              <input required value={form.especie} onChange={(e) => setForm({ ...form, especie: e.target.value })}
                placeholder="Ex: Cachorro"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
              <input value={form.raca} onChange={(e) => setForm({ ...form, raca: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
              <input type="date" value={form.dataNascimento ?? ''} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input type="number" min="0" step="0.1" value={form.peso ?? ''} onChange={(e) => setForm({ ...form, peso: e.target.value ? parseFloat(e.target.value) : undefined })}
                placeholder="Ex: 10.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tutor *</label>
              <select required value={form.tutorId} onChange={(e) => setForm({ ...form, tutorId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600">
                <option value="">Selecione...</option>
                {tutores.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="mt-4 bg-green-600 text-white text-sm font-medium px-6 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 disabled:opacity-50">
            {saving ? 'Salvando...' : 'Cadastrar'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {animais.map((animal) => (
          <div key={animal.id} className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">

            {/* Cabeçalho */}
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold text-gray-700">{animal.nome}</p>
                <p className="text-sm text-gray-500">{animal.especie}{animal.raca ? ` · ${animal.raca}` : ''} · Tutor: {animal.tutor?.nome ?? '—'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleExpand(animal.id)}
                  className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300">
                  {expanded === animal.id ? 'Fechar' : 'Visualizar'}
                </button>
                <button onClick={() => { startEdit(animal); setExpanded(null); }}
                  className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg border border-blue-600 hover:bg-white hover:text-blue-600 transition duration-300">
                  Editar
                </button>
                <button onClick={() => handleDeleteAnimal(animal.id)}
                  className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg border border-red-500 hover:bg-white hover:text-red-500 transition duration-300">
                  Remover
                </button>
              </div>
            </div>

            {/* Painel Editar */}
            {editing === animal.id && (
              <div className="border-t px-6 py-4 bg-blue-50">
                <h3 className="text-sm font-semibold text-blue-700 mb-3">Editar Animal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Data de nascimento</label>
                    <input type="date" value={editForm.dataNascimento}
                      onChange={(e) => setEditForm((f) => ({ ...f, dataNascimento: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Peso (kg)</label>
                    <input type="number" min="0" step="0.1" value={editForm.peso}
                      onChange={(e) => setEditForm((f) => ({ ...f, peso: e.target.value }))}
                      placeholder="Ex: 10.5"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Comida favorita</label>
                    <input type="text" value={editForm.comidaFavorita}
                      onChange={(e) => setEditForm((f) => ({ ...f, comidaFavorita: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Brincadeira favorita</label>
                    <input type="text" value={editForm.brincadeiraFavorita}
                      onChange={(e) => setEditForm((f) => ({ ...f, brincadeiraFavorita: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Curiosidade</label>
                    <input type="text" value={editForm.curiosidade}
                      onChange={(e) => setEditForm((f) => ({ ...f, curiosidade: e.target.value }))}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleUpdateAnimal(animal.id)} disabled={saving}
                    className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button onClick={() => setEditing(null)}
                    className="text-xs border border-gray-300 text-gray-500 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Painel Visualizar + Vacinas */}
            {expanded === animal.id && (
              <div className="border-t bg-gray-50">
                {/* Detalhes */}
                <div className="px-6 py-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3">Detalhes</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1.5">
                    <DetailRow label="Aniversário" value={animal.dataNascimento ? new Date(animal.dataNascimento).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : null} />
                    <DetailRow label="Idade" value={animal.dataNascimento ? calcularIdade(animal.dataNascimento) : null} />
                    <DetailRow label="Peso" value={animal.peso != null ? `${animal.peso} kg` : null} />
                    <DetailRow label="Comida favorita" value={animal.comidaFavorita ?? null} />
                    <DetailRow label="Brincadeira favorita" value={animal.brincadeiraFavorita ?? null} />
                    <DetailRow label="Curiosidade" value={animal.curiosidade ?? null} />
                  </div>
                </div>

                {/* Vacinas */}
                <div className="border-t px-6 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-600">Vacinas</h3>
                    {showVacinaFormFor !== animal.id && (
                      <button type="button"
                        onClick={() => { setShowVacinaFormFor(animal.id); setVacinaForm({ animalId: animal.id, nome: '', dataAplicacao: '' }); }}
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300">
                        + Registrar Vacina
                      </button>
                    )}
                  </div>
                  {(vacinas[animal.id] ?? []).length === 0 ? (
                    <p className="text-xs text-gray-400 mb-3">Nenhuma vacina registrada.</p>
                  ) : (
                    <ul className="mb-4 space-y-2">
                      {vacinas[animal.id].map((v) => (
                        <li key={v.id} className="bg-white rounded-lg border border-gray-100">
                          {editingVacina === v.id ? (
                            <div className="px-3 py-2 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-0.5">Nome</label>
                                  <input type="text" value={editVacinaForm.nome}
                                    onChange={(e) => setEditVacinaForm((f) => ({ ...f, nome: e.target.value }))}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-0.5">Data aplicação</label>
                                  <input type="date" value={editVacinaForm.dataAplicacao}
                                    onChange={(e) => setEditVacinaForm((f) => ({ ...f, dataAplicacao: e.target.value }))}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-0.5">Próxima dose</label>
                                  <input type="date" value={editVacinaForm.proximaDose}
                                    onChange={(e) => setEditVacinaForm((f) => ({ ...f, proximaDose: e.target.value }))}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 mb-0.5">Observações</label>
                                  <input type="text" value={editVacinaForm.observacoes}
                                    onChange={(e) => setEditVacinaForm((f) => ({ ...f, observacoes: e.target.value }))}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500" />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleUpdateVacina(v.id, animal.id)} disabled={saving}
                                  className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition disabled:opacity-50">
                                  {saving ? 'Salvando...' : 'Salvar'}
                                </button>
                                <button onClick={() => setEditingVacina(null)}
                                  className="text-xs border border-gray-300 text-gray-500 px-3 py-1 rounded hover:bg-gray-50 transition">
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-600">
                              <span><strong>{v.nome}</strong> · {new Date(v.dataAplicacao).toLocaleDateString('pt-BR')}{v.proximaDose ? ` · próx: ${new Date(v.proximaDose).toLocaleDateString('pt-BR')}` : ''}{v.observacoes ? ` · ${v.observacoes}` : ''}</span>
                              <div className="flex gap-1 ml-2">
                                <button onClick={() => startEditVacina(v)}
                                  className="text-xs text-blue-500 border border-blue-200 px-2 py-0.5 rounded hover:bg-blue-50 transition">
                                  Editar
                                </button>
                                <button onClick={() => handleDeleteVacina(v.id, animal.id)}
                                  className="text-xs text-red-400 border border-red-200 px-2 py-0.5 rounded hover:bg-red-50 transition">
                                  Remover
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {showVacinaFormFor === animal.id && (
                    <form onSubmit={(e) => { handleCreateVacina(e); setShowVacinaFormFor(null); }}>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-0.5">Nome *</label>
                          <input required value={vacinaForm.nome}
                            onChange={(e) => setVacinaForm({ ...vacinaForm, nome: e.target.value, animalId: animal.id })}
                            placeholder="Ex: V10"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-green-600" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-0.5">Data aplicação *</label>
                          <input required type="date" value={vacinaForm.dataAplicacao}
                            onChange={(e) => setVacinaForm({ ...vacinaForm, dataAplicacao: e.target.value, animalId: animal.id })}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-green-600" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-0.5">Próxima dose</label>
                          <input type="date" value={vacinaForm.proximaDose ?? ''}
                            onChange={(e) => setVacinaForm({ ...vacinaForm, proximaDose: e.target.value, animalId: animal.id })}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-green-600" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-0.5">Observações</label>
                          <input type="text" value={vacinaForm.observacoes ?? ''}
                            onChange={(e) => setVacinaForm({ ...vacinaForm, observacoes: e.target.value, animalId: animal.id })}
                            placeholder="Ex: Aplicada sem intercorrências"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-green-600" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" disabled={saving}
                          className="bg-green-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 disabled:opacity-50">
                          {saving ? 'Salvando...' : 'Registrar'}
                        </button>
                        <button type="button" onClick={() => setShowVacinaFormFor(null)}
                          className="text-xs border border-gray-300 text-gray-500 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition">
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimaisView;
