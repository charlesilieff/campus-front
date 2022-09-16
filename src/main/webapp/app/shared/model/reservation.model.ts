import dayjs from 'dayjs';
import { IPricing } from 'app/shared/model/pricing.model';
import { IBed } from 'app/shared/model/bed.model';
import { ICustomer } from 'app/shared/model/customer.model';

export interface IReservation {
  id?: number;
  personNumber?: number;
  paymentMode?: string | null;
  isPaid?: boolean;
  isConfirmed?: boolean;
  reservationNumber?: string | null;
  specialDietNumber?: number;
  isLunchOnly?: boolean;
  isArrivalDiner?: boolean;
  isDepartureDiner?: boolean;
  isArrivalLunch?: boolean;
  isDepartureLunch?: boolean;
  arrivalDate?: Date;
  departureDate?: Date;
  comment?: string | null;
  pricing?: IPricing | null;
  beds?: IBed[] | null;
  customer?: ICustomer | null;
  rooms?: string[];
}

export const defaultValue: Readonly<IReservation> = {
  isLunchOnly: false,
  isPaid: false,
  isConfirmed: false,
  isArrivalDiner: true,
  isDepartureDiner: false,
  isArrivalLunch: true,
  isDepartureLunch: true,
};
