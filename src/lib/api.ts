const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('clinivet_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Erro na requisição');
  }

  return res.json();
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{ access_token: string; user: { id: string; nome: string; email: string; role: 'ADMIN' | 'TUTOR' } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),
};

// Users
export const usersApi = {
  list: () => request<User[]>('/users'),
  create: (data: { nome: string; telefone: string }) =>
    request<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request<{ id: string; nome: string; email: string; role: 'ADMIN' | 'TUTOR' }>('/users/me'),
};

// Animais
export const animaisApi = {
  list: () => request<Animal[]>('/animais'),
  get: (id: string) => request<Animal>(`/animais/${id}`),
  create: (data: CreateAnimalData) =>
    request<Animal>('/animais', { method: 'POST', body: JSON.stringify(data) }),
  updateFoto: (id: string, foto: string) =>
    request<Animal>(`/animais/${id}/foto`, { method: 'PATCH', body: JSON.stringify({ foto }) }),
  delete: (id: string) => request<Animal>(`/animais/${id}`, { method: 'DELETE' }),
};

// Agendamentos
export const agendamentosApi = {
  list: () => request<Agendamento[]>('/agendamentos'),
  get: (id: string) => request<Agendamento>(`/agendamentos/${id}`),
  create: (data: CreateAgendamentoData) =>
    request<Agendamento>('/agendamentos', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: StatusAgendamento) =>
    request<Agendamento>(`/agendamentos/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// Vacinas
export const vacinasApi = {
  listByAnimal: (animalId: string) => request<Vacina[]>(`/vacinas/animal/${animalId}`),
  create: (data: CreateVacinaData) =>
    request<Vacina>('/vacinas', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: string) => request<Vacina>(`/vacinas/${id}`, { method: 'DELETE' }),
};

// Types
export type Role = 'ADMIN' | 'TUTOR';
export type StatusAgendamento = 'AGENDADO' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
export type TipoAgendamento = 'CONSULTA' | 'BANHO_TOSA' | 'PETSITTER';

export interface User {
  id: string;
  nome: string;
  email: string | null;
  telefone: string;
  role: Role;
  createdAt: string;
}

export interface Animal {
  id: string;
  nome: string;
  especie: string;
  raca: string | null;
  dataNascimento: string | null;
  foto: string | null;
  tutorId: string;
  createdAt: string;
  tutor?: { id: string; nome: string; email: string | null };
}

export interface Agendamento {
  id: string;
  animalId: string;
  tutorId: string;
  tipo: TipoAgendamento;
  data: string;
  horaInicio: string;
  horaFim: string | null;
  status: StatusAgendamento;
  observacoes: string | null;
  animal: { id: string; nome: string; especie: string };
  tutor?: { id: string; nome: string; email: string | null };
}

export interface Vacina {
  id: string;
  animalId: string;
  nome: string;
  dataAplicacao: string;
  proximaDose: string | null;
  observacoes: string | null;
}

export interface CreateAnimalData {
  nome: string;
  especie: string;
  raca?: string;
  dataNascimento?: string;
  tutorId: string;
}

export interface CreateAgendamentoData {
  animalId: string;
  tipo: TipoAgendamento;
  data: string;
  horaInicio: string;
  horaFim?: string;
  observacoes?: string;
  status?: StatusAgendamento;
}

export interface CreateVacinaData {
  animalId: string;
  nome: string;
  dataAplicacao: string;
  proximaDose?: string;
  observacoes?: string;
}
