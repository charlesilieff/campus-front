import * as S from '@effect/schema/Schema'

export const OneBedReservationDatesAndMeals = S.struct({
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
export type OneBedReservationDatesAndMeals = S.To<typeof OneBedReservationDatesAndMeals>

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
