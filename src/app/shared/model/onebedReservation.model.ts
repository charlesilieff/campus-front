import type * as O from '@effect/data/Option'

import type { Customer } from './customer.model'

export interface OneBedUserReservation {
  id: O.Option<number>
  arrivalDate: Date
  departureDate: Date
  isArrivalDiner: boolean
  isArrivalLunch: boolean
  isDepartureDiner: boolean
  isDepartureLunch: boolean
  isSpecialDiet: boolean
  customer: Customer
  bedId: O.Option<number>
  comment: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: string
  userId: number
}
