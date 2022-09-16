import { ICustomer } from './customer.model';
import { IReservation } from './reservation.model';

export interface IReservationRequest {
  reservation?: IReservation | null;
  customer?: ICustomer | null;
}

export const defaultValue: Readonly<IReservationRequest> = {};
