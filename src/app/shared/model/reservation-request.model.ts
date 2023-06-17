import type { CustomerEncoded } from './customer.model'
import type { IReservation } from './reservation.model'

export interface IReservationRequest {
  reservation?: IReservation | null
  customer?: CustomerEncoded | null
}

export const defaultValue: Readonly<IReservationRequest> = {}
