'use client';

import { useEffect, useState } from 'react';
import { animaisApi, Animal } from '@/lib/api';

export function useAnimais() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animaisApi.list()
      .then(setAnimais)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { animais, setAnimais, loading };
}
