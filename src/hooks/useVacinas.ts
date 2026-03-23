'use client';

import { useEffect, useState } from 'react';
import { animaisApi, vacinasApi, Animal, Vacina } from '@/lib/api';

export interface VacinaComAnimal extends Vacina {
  animal: Animal;
}

export function useVacinas() {
  const [vacinas, setVacinas] = useState<VacinaComAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    animaisApi.list()
      .then((pets) =>
        Promise.all(
          pets.map(async (pet) => {
            const vs = await vacinasApi.listByAnimal(pet.id);
            return vs.map((v): VacinaComAnimal => ({ ...v, animal: pet }));
          })
        )
      )
      .then((groups) => setVacinas(groups.flat()))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { vacinas, setVacinas, loading };
}
