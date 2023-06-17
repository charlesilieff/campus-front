import type { Customer } from './customer.model'
import type { IReservation } from './reservation.model'

export interface IReservationRequest {
  reservation?: IReservation | null
  customer?: Customer | null
}

export const defaultValue: Readonly<IReservationRequest> = {}
