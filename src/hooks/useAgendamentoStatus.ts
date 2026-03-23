'use client';

import { useState } from 'react';
import { agendamentosApi, Agendamento, StatusAgendamento } from '@/lib/api';

interface Options {
  setAgendamentos: React.Dispatch<React.SetStateAction<Agendamento[]>>;
}

export function useAgendamentoStatus({ setAgendamentos }: Options) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [concluirId, setConcluirId] = useState<string | null>(null);

  const handleStatus = async (id: string, status: StatusAgendamento) => {
    if (status === 'CONCLUIDO') {
      setConcluirId(id);
      return;
    }
    setUpdating(id);
    try {
      const updated = await agendamentosApi.updateStatus(id, status);
      setAgendamentos((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    } finally {
      setUpdating(null);
    }
  };

  return { updating, concluirId, setConcluirId, handleStatus };
}
