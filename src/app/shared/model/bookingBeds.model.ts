import * as S from '@effect/schema/Schema'
import { pipe } from 'effect'

import { Customer } from './customer.model'
import { FormatLocalDate } from './formatLocalDate'

// export interface BookingBeds {
//   id?: number
//   firstname?: string
//   lastname?: string
//   age?: number
//   phoneNumber?: string
//   email?: string
//   pricingId?: number
//   arrivalDate?: Date
//   departureDate?: Date
//   customerComment?: string
//   isArrivalDinner?: boolean
//   isArrivalLunch?: boolean
//   isDepartureDinner?: boolean
//   isDepartureLunch?: boolean
//   reservationComment?: string
//   personNumber?: number
//   specialDietNumber?: number
//   customer?: CustomerEncoded
//   // pricing?: IPricing
//   // userCategoryId?: number
//   userCategory?: UserCategory
//   isPaid?: boolean
//   isConfirmed?: boolean
//   paymentMode?: string | null
//   bedIds: number[]
//   comment?: string
//   isArrivalBreakfast?: boolean
//   isDepartureBreakfast?: boolean
//   mealsComment?: string
// }

export const ReservationSchema = S.struct({
  id: S.positive()(S.number),
  arrivalDate: FormatLocalDate,
  departureDate: FormatLocalDate,
  isArrivalDinner: S.boolean,
  isArrivalLunch: S.boolean,
  isDepartureDinner: S.boolean,
  isDepartureLunch: S.boolean,
  personNumber: S.number,
  specialDietNumber: S.number,
  customer: Customer,
  // pricing: IPricing
  // userCategoryId: S.number,
  isPaid: S.boolean,
  isConfirmed: S.boolean,
  comment: S.optional(S.string).toOption(),
  isArrivalBreakfast: S.boolean,
  isDepartureBreakfast: S.boolean,
  commentMeals: S.optional(S.string).toOption()
})

export type ReservationSchema = S.Schema.To<typeof ReservationSchema>

export const ReservationSchemaWithBedIds = pipe(
  S.extend(
    ReservationSchema,
    S.struct({
      bedIds: S.array(S.number)
    })
  )
)

export type ReservationSchemaWithBedIds = S.Schema.To<typeof ReservationSchemaWithBedIds>

export const ReservationCreateSchemaWithBedIds = pipe(
  ReservationSchemaWithBedIds,
  S.omit('id')
)

export type ReservationCreateSchemaWithBedIds = S.Schema.To<
  typeof ReservationCreateSchemaWithBedIds
>
