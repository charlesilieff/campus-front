import * as S from '@effect/schema/Schema'
import { MealsDay, WeekDaysName } from 'app/shared/model/mealsReservation.model'
import dayjs from 'dayjs'
import { pipe } from 'effect'

export const OneBedReservationDatesAndMeals = pipe(
  S.struct({
    arrivalDate: pipe(
      S.DateFromSelf,
      S.filter(d => dayjs(d).add(1, 'day').isAfter(dayjs()), {
        title: 'arrivalDate',
        message: () => "La date d'arrivée doit être supérieure à la date du jour."
      })
    ),
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
  }),
  S.filter(d => d.arrivalDate <= d.departureDate, {
    title: 'arrivalDate',
    message: input =>
      `La date d'arrivée doit être avant la date de départ: ${input.departureDate.toLocaleDateString()}.`
  })
)
export type OneBedReservationDatesAndMeals = S.To<typeof OneBedReservationDatesAndMeals>

export const MealsOnlyReservationDatesAndMeals = pipe(
  S.struct({
    arrivalDate: S.DateFromSelf,
    departureDate: S.DateFromSelf,
    isSpecialDiet: S.literal('false', 'true'),
    weekMeals: S.record(
      WeekDaysName,
      MealsDay
    ),
    comment: S.optional(S.string).toOption(),
    commentMeals: S.optional(S.string).toOption()
  }),
  S.filter(d => d.arrivalDate <= d.departureDate, {
    title: 'arrivalDate',
    message: input =>
      `La date d'arrivée doit être avant la date de départ: ${input.departureDate.toLocaleDateString()}.`
  })
)

export type MealsOnlyReservationDatesAndMeals = S.To<typeof MealsOnlyReservationDatesAndMeals>
