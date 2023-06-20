import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import type { BedDecoded, BedEncoded } from 'app/shared/model/bed.model'
import { Bed } from 'app/shared/model/bed.model'
import type { CustomerDecoded, CustomerEncoded } from 'app/shared/model/customer.model'
import { Customer } from 'app/shared/model/customer.model'
import type { IPricing } from 'app/shared/model/pricing.model'

import { FormatLocalDate } from './formatLocalDate'

export interface ReservationEncoded {
  id?: number
  personNumber: number
  paymentMode?: string
  isPaid: boolean
  isConfirmed: boolean
  reservationNumber?: string
  specialDietNumber: number
  isArrivalDinner: boolean
  isDepartureDinner: boolean
  isArrivalLunch: boolean
  isDepartureLunch: boolean
  arrivalDate: string
  departureDate: string
  comment?: string
  pricing?: IPricing
  beds: readonly BedEncoded[]
  customer?: CustomerEncoded
  // userCategory?: IUserCategory
  userCategoryId?: number
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals?: string
}

export interface ReservationDecoded {
  id: O.Option<number>
  personNumber: number
  paymentMode: O.Option<string>
  isPaid: boolean
  isConfirmed: boolean
  reservationNumber: O.Option<string>
  specialDietNumber: number
  isArrivalDinner: boolean
  isDepartureDinner: boolean
  isArrivalLunch: boolean
  isDepartureLunch: boolean
  arrivalDate: Date
  departureDate: Date
  comment: O.Option<string>
  // pricing: O.Option<IPricing>
  beds: readonly BedDecoded[]
  customer: O.Option<CustomerDecoded>

  // userCategory: O.Option<IUserCategory>
  userCategoryId: O.Option<number>
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: O.Option<string>
}

export const Reservation: S.Schema<ReservationEncoded, ReservationDecoded> = S.lazy(() =>
  S.struct({
    id: S.optional(S.number).toOption(),
    personNumber: S.number,
    paymentMode: S.optional(S.string).toOption(),
    isPaid: S.boolean,
    isConfirmed: S.boolean,
    reservationNumber: S.optional(S.UUID).toOption(),
    specialDietNumber: S.number,
    isArrivalDinner: S.boolean,
    isDepartureDinner: S.boolean,
    isArrivalLunch: S.boolean,
    isDepartureLunch: S.boolean,
    arrivalDate: FormatLocalDate,

    departureDate: FormatLocalDate,
    comment: S.optional(S.string).toOption(),
    // pricing: S.optional(S.lazy(() => Pricing)).toOption(),
    beds: S.array(S.lazy(() => Bed)),
    customer: S.optional(S.lazy(() => Customer)).toOption(),
    // userCategory: S.optional(S.lazy(() => UserCategory)).toOption(),
    userCategoryId: S.optional(S.number).toOption(),
    isArrivalBreakfast: S.boolean,
    isDepartureBreakfast: S.boolean,
    commentMeals: S.optional(S.string).toOption()
  })
)

export type Reservation = S.To<typeof Reservation>
