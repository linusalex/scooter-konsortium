import type { Scooter } from '$lib/interfaces/scooter';

export const load = () => {
  const scooters = [
    {
      id: 1,
      distance: 200,
      soc: 95,
      latitude: 51.1589035 + 0.001,
      longitude: 7.0972745 + 0.001,
    },
    {
      id: 2,
      distance: 100,
      soc: 20,
      latitude: 51.1589035 - 0.01,
      longitude: 7.0972745 - 0.01,
    },
  ] satisfies Scooter[];

  return {
    scooters,
  };
};
