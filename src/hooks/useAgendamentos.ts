'use client';

import { useEffect, useState } from 'react';
import { agendamentosApi, Agendamento } from '@/lib/api';

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agendamentosApi.list()
      .then(setAgendamentos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { agendamentos, setAgendamentos, loading };
}
