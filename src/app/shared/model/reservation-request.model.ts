import type { ICustomer } from './customer.model'
import type { IReservation } from './reservation.model'

export interface IReservationRequest {
  reservation?: IReservation | null
  customer?: ICustomer | null
}

export const defaultValue: Readonly<IReservationRequest> = {}
