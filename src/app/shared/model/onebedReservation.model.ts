import * as S from '@effect/schema/Schema'
import type { Option as O } from 'effect'

import { Customer, type CustomerDecoded, type CustomerEncoded } from './customer.model'
import { FormatLocalDate } from './formatLocalDate'

export interface OneBedUserReservation {
  id: O.Option<number>
  arrivalDate: Date
  departureDate: Date
  isArrivalDinner: boolean
  isArrivalLunch: boolean
  isDepartureDinner: boolean
  isDepartureLunch: boolean
  isSpecialDiet: boolean
  customer: CustomerDecoded
  bedId: O.Option<number>
  comment: O.Option<string>
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: O.Option<string>
  userId: number
}

export interface OneBedUserReservationEncoded {
  id?: number
  arrivalDate: string
  departureDate: string
  isArrivalDinner: boolean
  isArrivalLunch: boolean
  isDepartureDinner: boolean
  isDepartureLunch: boolean
  isSpecialDiet: boolean
  customer: CustomerEncoded
  bedId?: number
  comment?: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals?: string
  userId: number
}

export const OneBedUserReservation: S.Schema<OneBedUserReservationEncoded, OneBedUserReservation> =
  S.struct({
    id: S.optional(S.number).toOption(),
    arrivalDate: FormatLocalDate,
    departureDate: FormatLocalDate,
    isArrivalDinner: S.boolean,
    isArrivalLunch: S.boolean,
    isDepartureDinner: S.boolean,
    isDepartureLunch: S.boolean,
    isSpecialDiet: S.boolean,
    customer: S.lazy(() => Customer),
    bedId: S.optional(S.number).toOption(),
    comment: S.optional(S.string).toOption(),
    isArrivalBreakfast: S.boolean,
    isDepartureBreakfast: S.boolean,
    commentMeals: S.optional(S.string).toOption(),
    userId: S.number
  })
