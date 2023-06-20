import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import type { CustomerDecoded, CustomerEncoded } from 'app/shared/model/customer.model'
import { Customer } from 'app/shared/model/customer.model'
import type { IPricing } from 'app/shared/model/pricing.model'

export interface DatesAndMealsEncoded {
  id?: number
  personNumber: number
  paymentMode?: string
  reservationNumber?: string
  specialDietNumber: number
  isArrivalDinner: boolean
  isDepartureDinner: boolean
  isArrivalLunch: boolean
  isDepartureLunch: boolean
  arrivalDate: Date
  departureDate: Date
  comment?: string
  pricing?: IPricing
  customer?: CustomerEncoded
  // userCategory?: IUserCategory
  userCategoryId?: number
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals?: string
}

export interface DatesAndMealsDecoded {
  id: O.Option<number>
  personNumber: number
  paymentMode: O.Option<string>
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
  customer: O.Option<CustomerDecoded>

  // userCategory: O.Option<IUserCategory>
  userCategoryId: O.Option<number>
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: O.Option<string>
}

export const DatesAndMeals: S.Schema<DatesAndMealsEncoded, DatesAndMealsDecoded> = S.lazy(() =>
  S.struct({
    id: S.optional(S.number).toOption(),
    personNumber: S.number,
    paymentMode: S.optional(S.string).toOption(),
    reservationNumber: S.optional(S.UUID).toOption(),
    specialDietNumber: S.number,
    isArrivalDinner: S.boolean,
    isDepartureDinner: S.boolean,
    isArrivalLunch: S.boolean,
    isDepartureLunch: S.boolean,
    arrivalDate: S.DateFromSelf,
    departureDate: S.DateFromSelf,
    comment: S.optional(S.string).toOption(),
    // pricing: S.optional(S.lazy(() => Pricing)).toOption(),
    customer: S.optional(S.lazy(() => Customer)).toOption(),
    // userCategory: S.optional(S.lazy(() => UserCategory)).toOption(),
    userCategoryId: S.optional(S.number).toOption(),
    isArrivalBreakfast: S.boolean,
    isDepartureBreakfast: S.boolean,
    commentMeals: S.optional(S.string).toOption()
  })
)

export type DatesAndMeals = S.To<typeof DatesAndMeals>
