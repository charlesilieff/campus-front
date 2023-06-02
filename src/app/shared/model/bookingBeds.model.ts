import * as S from '@effect/schema/Schema'

import type { ICustomer } from './customer.model'
import { CustomerSchema } from './customer.model'
import type { IUserCategory } from './userCategory.model'

export interface IBookingBeds {
  id?: number
  firstname?: string
  lastname?: string
  age?: number
  phoneNumber?: string
  email?: string
  pricingId?: number
  arrivalDate?: Date
  departureDate?: Date
  customerComment?: string
  isArrivalDiner?: boolean
  isArrivalLunch?: boolean
  isDepartureDiner?: boolean
  isDepartureLunch?: boolean
  reservationComment?: string
  personNumber?: number
  specialDietNumber?: number
  customer?: ICustomer
  // pricing?: IPricing
  // userCategoryId?: number
  userCategory?: IUserCategory
  isPaid?: boolean
  isConfirmed?: boolean
  paymentMode?: string | null
  bedIds: number[]
  comment?: string
  isArrivalBreakfast?: boolean
  isDepartureBreakfast?: boolean
  mealsComment?: string
}

export const defaultValue: Readonly<IBookingBeds> = {
  isPaid: false,
  isConfirmed: false,
  paymentMode: null,
  bedIds: []
}

export const ReservationSchema = S.struct({
  id: S.positive()(S.number),
  arrivalDate: S.Date,
  departureDate: S.Date,
  isArrivalDiner: S.boolean,
  isArrivalLunch: S.boolean,
  isDepartureDiner: S.boolean,
  isDepartureLunch: S.boolean,
  personNumber: S.number,
  specialDietNumber: S.number,
  customer: CustomerSchema,
  // pricing: IPricing
  // userCategoryId: S.number,
  isPaid: S.boolean,
  isConfirmed: S.boolean,
  comment: S.string,
  isArrivalBreakfast: S.boolean,
  isDepartureBreakfast: S.boolean,
  commentMeals: S.string
})

export type ReservationSchema = S.To<typeof ReservationSchema>
