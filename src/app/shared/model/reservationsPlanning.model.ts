import * as S from '@effect/schema/Schema'
import type { CustomerDecoded } from 'app/shared/model/customer.model'
import { Customer, type CustomerEncoded } from 'app/shared/model/customer.model'

import { FormatLocalDate } from './formatLocalDate'

export const ReservationStatus = S.literal('pending', 'processed', 'urgent')
export type ReservationStatus = S.Schema.To<typeof ReservationStatus>
export interface ReservationsPlanningEncoded {
  readonly id: number
  readonly isPaid: boolean
  readonly isConfirmed: boolean
  readonly personNumber: number
  readonly customer: CustomerEncoded
  // readonly firstName: string
  // readonly lastName: string
  // readonly age: number
  // readonly phoneNumber: number
  // readonly email: string
  // readonly comment: string
  readonly arrivalDate: string
  readonly departureDate: string
  readonly bedsId: readonly number[]
  readonly status: ReservationStatus
}

export interface ReservationsPlanning {
  readonly id: number
  readonly isPaid: boolean
  readonly isConfirmed: boolean
  readonly personNumber: number
  readonly customer: CustomerDecoded
  // readonly firstName: string
  // readonly lastName: string
  // readonly age: number
  // readonly phoneNumber: number
  // readonly email: string
  // readonly comment: string
  readonly arrivalDate: Date
  readonly departureDate: Date
  readonly bedsId: readonly number[]
  readonly status: ReservationStatus
}

export const ReservationsPlanning: S.Schema<ReservationsPlanningEncoded, ReservationsPlanning> = S
  .struct({
    id: S.number,
    isPaid: S.boolean,
    isConfirmed: S.boolean,
    personNumber: S.number,
    customer: Customer,
    // firstName: S.string,
    // lastName: S.string,
    // age: S.number,
    // phoneNumber: S.number,
    // email: S.string,
    // comment: S.string,
    arrivalDate: FormatLocalDate,
    departureDate: FormatLocalDate,
    bedsId: S.array(S.number),
    status: ReservationStatus
  })
