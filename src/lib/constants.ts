import type { StatusAgendamento } from '@/lib/api';

export const TIPO_LABEL: Record<string, string> = {
  CONSULTA: 'Consulta',
  BANHO_TOSA: 'Banho e Tosa',
  PETSITTER: 'Pet Sitter',
};

export const STATUS_LABEL: Record<string, string> = {
  AGENDADO: 'Agendado',
  CONFIRMADO: 'Confirmado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
};

export const STATUS_COLOR: Record<string, string> = {
  AGENDADO: 'bg-yellow-100 text-yellow-700',
  CONFIRMADO: 'bg-blue-100 text-blue-700',
  CONCLUIDO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-600',
};

export const STATUS_DOT: Record<string, string> = {
  AGENDADO: 'bg-yellow-400',
  CONFIRMADO: 'bg-blue-400',
  CONCLUIDO: 'bg-green-500',
  CANCELADO: 'bg-red-400',
};

export const STATUS_OPTIONS: StatusAgendamento[] = [
  'AGENDADO',
  'CONFIRMADO',
  'CONCLUIDO',
  'CANCELADO',
];

export const FILTRO_OPTIONS = [
  { label: 'Todos', value: 'TODOS' },
  { label: 'Pendentes', value: 'AGENDADO' },
  { label: 'Confirmados', value: 'CONFIRMADO' },
  { label: 'Concluídos', value: 'CONCLUIDO' },
  { label: 'Cancelados', value: 'CANCELADO' },
] as const;

export const FILTRO_COLOR: Record<string, string> = {
  TODOS: 'bg-gray-100 text-gray-700 border-gray-200',
  AGENDADO: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  CONFIRMADO: 'bg-blue-100 text-blue-700 border-blue-300',
  CONCLUIDO: 'bg-green-100 text-green-700 border-green-300',
  CANCELADO: 'bg-red-100 text-red-600 border-red-300',
};

export const FILTRO_COLOR_ACTIVE: Record<string, string> = {
  TODOS: 'bg-gray-700 text-white border-gray-700',
  AGENDADO: 'bg-yellow-400 text-white border-yellow-400',
  CONFIRMADO: 'bg-blue-500 text-white border-blue-500',
  CONCLUIDO: 'bg-green-600 text-white border-green-600',
  CANCELADO: 'bg-red-500 text-white border-red-500',
};

export const TIPO_SERVICO = [
  { key: 'CONSULTA', label: 'Consulta', color1: '#10b981', color2: '#34d399' },
  { key: 'BANHO_TOSA', label: 'Banho e Tosa', color1: '#0ea5e9', color2: '#38bdf8' },
  { key: 'PETSITTER', label: 'Pet Sitter', color1: '#8b5cf6', color2: '#a78bfa' },
];
