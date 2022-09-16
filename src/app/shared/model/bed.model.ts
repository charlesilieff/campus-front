import { IRoom } from 'app/shared/model/room.model';
import { IReservation } from 'app/shared/model/reservation.model';

export interface IBed {
  id?: number;
  kind?: string;
  number?: string;
  numberOfPlaces?: number;
  room?: IRoom | null;
  reservations?: IReservation[] | null;
}

export const defaultValue: Readonly<IBed> = {};
