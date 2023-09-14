import * as S from '@effect/schema/Schema'

import type { CustomerDecoded, CustomerEncoded } from './customer.model'
import { Customer } from './customer.model'
import type { ReservationDecoded, ReservationEncoded } from './reservation.model'
import { Reservation } from './reservation.model'

export interface ReservationRequestEncoded {
  reservation: ReservationEncoded
  customer: CustomerEncoded
}

export interface ReservationRequestDecoded {
  reservation: ReservationDecoded
  customer: CustomerDecoded
}

export const ReservationRequest: S.Schema<ReservationRequestEncoded, ReservationRequestDecoded> = S
  .lazy(() =>
    S.struct({
      reservation: Reservation,
      customer: Customer
    })
  )

export type ReservationRequest = S.Schema.To<typeof ReservationRequest>
