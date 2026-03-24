import { useEffect, useState } from 'react';
import { despesasApi, Despesa } from '@/lib/api';

export function useDespesas(mes: string) {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    despesasApi.list(mes).then(setDespesas).catch(console.error).finally(() => setLoading(false));
  }, [mes]);

  return { despesas, setDespesas, loading };
}
