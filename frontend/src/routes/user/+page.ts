import type { RentedScooter } from '$lib/interfaces/scooter';
import { v4 as uuidv4 } from 'uuid';

const random = Math.random();

const yesterday = new Date();
yesterday.setDate(yesterday.getDay() - 1);
yesterday.setHours(18, 0, 0, 0);

const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDay() - 2);
twoDaysAgo.setHours(13, 25, 0, 0);

export const load = () => {
  const rentedScooter = [
    {
      id: uuidv4(),
      fromTime: Date.now(),
      toTime: Date.now() + 30 * 60 * 1000,
      scooter: {
        id: 1,
        distance: 200,
        soc: 95,
        latitude: 51.1589035,
        longitude: 7.0972745,
      },
      user: {
        id: uuidv4(),
        firstName: 'Jistin',
        lastName: 'Siggi',
      },
      price: 12,
    },
    {
      id: uuidv4(),
      fromTime: yesterday.getTime(),
      toTime: yesterday.getTime() + Math.floor(Math.random() * 19) * 60 * 1000,
      scooter: {
        id: 1,
        distance: 200,
        soc: 95,
        latitude: 51.1589035,
        longitude: 7.0972745,
      },
      user: {
        id: uuidv4(),
        firstName: 'Jistin',
        lastName: 'Siggi',
      },
      price: 3.5,
    },
    {
      id: uuidv4(),
      fromTime: twoDaysAgo.getTime(),
      toTime: twoDaysAgo.getTime() + Math.floor(Math.random() * 19) * 60 * 1000,
      scooter: {
        id: 1,
        distance: 200,
        soc: 95,
        latitude: 51.1589035,
        longitude: 7.0972745,
      },
      user: {
        id: uuidv4(),
        firstName: 'Jistin',
        lastName: 'Siggi',
      },
      price: 2.8,
    },
  ] satisfies RentedScooter[];

  return {
    rentedScooter,
  };
};
