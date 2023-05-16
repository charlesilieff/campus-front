import type * as O from '@effect/data/Option'

export interface OneBedReservationDatesAndMeals {
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

export interface MealsOnlyReservationDatesAndMeals {
  arrivalDate: string
  departureDate: string
  isSpecialDiet: 'false' | 'true'
  weekMeals: {
    monday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    tuesday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    wednesday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    thursday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    friday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    saturday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    sunday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
  }
  comment: string
  commentMeals: string
}

export interface Customer {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: O.Option<string>
  age: O.Option<number>
}
