import type * as O from '@effect/data/Option'

import type { CustomerEncoded } from './customer.model'

export interface OneBedUserReservation {
  id: O.Option<number>
  arrivalDate: Date
  departureDate: Date
  isArrivalDinner: boolean
  isArrivalLunch: boolean
  isDepartureDinner: boolean
  isDepartureLunch: boolean
  isSpecialDiet: boolean
  customer: CustomerEncoded
  bedId: O.Option<number>
  comment: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: string
  userId: number
}
