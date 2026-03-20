'use client';

import { useEffect, useState } from 'react';
import { animaisApi, usersApi, vacinasApi, Animal, User, Vacina, CreateAnimalData, CreateVacinaData } from '@/lib/api';

export default function AnimaisPage() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [tutores, setTutores] = useState<User[]>([]);
  const [vacinas, setVacinas] = useState<Record<string, Vacina[]>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showVacinaForm, setShowVacinaForm] = useState<string | null>(null);
  const [form, setForm] = useState<CreateAnimalData>({ nome: '', especie: '', raca: '', tutorId: '' });
  const [vacinaForm, setVacinaForm] = useState<CreateVacinaData>({ animalId: '', nome: '', dataAplicacao: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([animaisApi.list(), usersApi.list()])
      .then(([a, u]) => {
        setAnimais(a);
        setTutores(u.filter((u) => u.role === 'TUTOR'));
      })
      .finally(() => setLoading(false));
  }, []);

  const loadVacinas = async (animalId: string) => {
    if (vacinas[animalId]) { setShowVacinaForm(animalId); return; }
    const v = await vacinasApi.listByAnimal(animalId);
    setVacinas((prev) => ({ ...prev, [animalId]: v }));
    setShowVacinaForm(animalId);
    setVacinaForm({ animalId, nome: '', dataAplicacao: '' });
  };

  const handleCreateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const novo = await animaisApi.create(form);
      setAnimais((prev) => [...prev, novo]);
      setShowForm(false);
      setForm({ nome: '', especie: '', raca: '', tutorId: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar animal.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateVacina = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const nova = await vacinasApi.create(vacinaForm);
      setVacinas((prev) => ({ ...prev, [vacinaForm.animalId]: [...(prev[vacinaForm.animalId] ?? []), nova] }));
      setVacinaForm((f) => ({ ...f, nome: '', dataAplicacao: '', proximaDose: '', observacoes: '' }));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao registrar vacina.');
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
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
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
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-semibold text-gray-700">{animal.nome}</p>
                <p className="text-sm text-gray-500">{animal.especie}{animal.raca ? ` · ${animal.raca}` : ''} · Tutor: {animal.tutor?.nome ?? '—'}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => loadVacinas(animal.id)}
                  className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300">
                  Vacinas
                </button>
                <button onClick={() => handleDeleteAnimal(animal.id)}
                  className="text-xs bg-white text-red-500 px-3 py-1.5 rounded-lg border border-red-300 hover:bg-red-500 hover:text-white transition duration-300">
                  Remover
                </button>
              </div>
            </div>

            {showVacinaForm === animal.id && (
              <div className="border-t px-6 py-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Vacinas</h3>
                {(vacinas[animal.id] ?? []).length === 0 ? (
                  <p className="text-xs text-gray-400 mb-3">Nenhuma vacina registrada.</p>
                ) : (
                  <ul className="mb-4 space-y-1">
                    {vacinas[animal.id].map((v) => (
                      <li key={v.id} className="flex items-center justify-between text-xs text-gray-600 bg-white rounded-lg px-3 py-2 border border-gray-100">
                        <span><strong>{v.nome}</strong> · {new Date(v.dataAplicacao).toLocaleDateString('pt-BR')}{v.proximaDose ? ` · próx: ${new Date(v.proximaDose).toLocaleDateString('pt-BR')}` : ''}</span>
                        <button onClick={() => handleDeleteVacina(v.id, animal.id)} className="text-red-400 hover:text-red-600 ml-2">✕</button>
                      </li>
                    ))}
                  </ul>
                )}
                <form onSubmit={handleCreateVacina} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Vacina *</label>
                    <input required value={vacinaForm.nome} onChange={(e) => setVacinaForm({ ...vacinaForm, nome: e.target.value, animalId: animal.id })}
                      placeholder="Ex: V10"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-green-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Data aplicação *</label>
                    <input required type="date" value={vacinaForm.dataAplicacao} onChange={(e) => setVacinaForm({ ...vacinaForm, dataAplicacao: e.target.value, animalId: animal.id })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:border-green-600" />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={saving}
                      className="w-full bg-green-600 text-white text-xs font-medium px-4 py-1.5 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 disabled:opacity-50">
                      {saving ? 'Salvando...' : '+ Registrar'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
