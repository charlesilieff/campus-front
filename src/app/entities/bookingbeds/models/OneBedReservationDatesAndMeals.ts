import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

export interface OneBedReservationDatesAndMealsEncoded {
  arrivalDate: Date
  departureDate: Date
  isSpecialDiet: 'false' | 'true'
  isArrivalLunch: boolean
  isArrivalDinner: boolean
  isDepartureLunch: boolean
  isDepartureDinner: boolean
  comment?: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals?: string
}

export interface OneBedReservationDatesAndMeals {
  arrivalDate: Date
  departureDate: Date
  isSpecialDiet: 'false' | 'true'
  isArrivalLunch: boolean
  isArrivalDinner: boolean
  isDepartureLunch: boolean
  isDepartureDinner: boolean
  comment: O.Option<string>
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: O.Option<string>
}

export const OneBedReservationDatesAndMeals: S.Schema<
  OneBedReservationDatesAndMealsEncoded,
  OneBedReservationDatesAndMeals
> = S.struct({
  arrivalDate: S.DateFromSelf,
  departureDate: S.DateFromSelf,
  isSpecialDiet: S.literal('false', 'true'),
  isArrivalLunch: S.boolean,
  isArrivalDinner: S.boolean,
  isDepartureLunch: S.boolean,
  isDepartureDinner: S.boolean,
  comment: S.optional(S.string).toOption(),
  isArrivalBreakfast: S.boolean,
  isDepartureBreakfast: S.boolean,
  commentMeals: S.optional(S.string).toOption()
})

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
