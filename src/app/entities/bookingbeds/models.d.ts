import type * as O from '@effect/data/Option'

export interface OneBedReservationDatesAndMeal {
  arrivalDate: string
  departureDate: string
  isSpecialDiet: 'false' | 'true'
  isArrivalLunch: boolean
  isArrivalDinner: boolean
  isDepartureLunch: boolean
  isDepartureDinner: boolean
  comment: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: string
}

export interface OneBedReservationDatesAndMealAndWeekEndMeals extends OneBedReservationDatesAndMeal {
  isWeekEndMeals: 'false' | 'true'
}

export interface Customer {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: O.Option<string>
  age: O.Option<number>
}
