'use client';

import { useEffect, useState } from 'react';
import { usersApi, User } from '@/lib/api';
import { maskTelefone } from '@/lib/masks';
import { useToast } from '@/contexts/ToastContext';

export function TutoresView() {
  const { showToast } = useToast();
  const [tutores, setTutores] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nome: '', telefone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    usersApi.list()
      .then((users) => setTutores(users.filter((u) => u.role === 'TUTOR')))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const novo = await usersApi.create(form);
      setTutores((prev) => [...prev, novo]);
      setShowForm(false);
      setForm({ nome: '', telefone: '' });
      showToast('Tutor pré-cadastrado! Ele deve acessar /login para ativar a conta.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar tutor.');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-green-600">Tutores</h1>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); }}
          className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300"
        >
          {showForm ? 'Cancelar' : '+ Novo Tutor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Pré-cadastrar Tutor</h2>
          <p className="text-sm text-gray-500 mb-4">O tutor receberá acesso e ativará a conta com telefone + email + senha.</p>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone * <span className="text-gray-400 font-normal">(XX) XXXXX-XXXX</span></label>
              <input required value={form.telefone} onChange={(e) => setForm({ ...form, telefone: maskTelefone(e.target.value) })}
                placeholder="(11) 99999-9999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="mt-4 bg-green-600 text-white text-sm font-medium px-6 py-2 rounded-lg border border-green-600 hover:bg-white hover:text-green-600 transition duration-300 disabled:opacity-50">
            {saving ? 'Salvando...' : 'Cadastrar'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden">
        {tutores.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Nenhum tutor cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">E-mail</th>
                  <th className="px-4 py-3 font-medium">Telefone</th>
                  <th className="px-4 py-3 font-medium">Situação</th>
                </tr>
              </thead>
              <tbody>
                {tutores.map((t) => (
                  <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{t.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{t.email ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{t.telefone}</td>
                    <td className="px-4 py-3">
                      {t.email ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Ativo</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Pendente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TutoresView;
