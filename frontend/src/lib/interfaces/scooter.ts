import type { User } from './user';

export interface Scooter {
  id: number;
  soc: number;
  distance: number;
  latitude: number;
  longitude: number;
}

export interface RentedScooter {
  id: string;
  fromTime: Date | number;
  toTime?: Date | number | undefined;
  scooter: Scooter;
  user: User;
  price: Number;
}
