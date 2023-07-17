import * as S from '@effect/schema/Schema'

import { Customer } from './customer.model'
import { FormatLocalDate } from './formatLocalDate'

export const MealsDay = S.struct({
  isBreakfast: S.boolean,
  isLunch: S.boolean,
  isDinner: S.boolean
})

export const WeekDaysName = S.literal(
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
)

export const MealsOnlyUserReservation = S.struct({
  reservationId: S.optional(S.number).toOption(),
  arrivalDate: FormatLocalDate,
  departureDate: FormatLocalDate,
  weekMeals: S.record(
    WeekDaysName,
    MealsDay
  ),
  customer: Customer,
  comment: S.optional(S.string).toOption(),
  commentMeals: S.optional(S.string).toOption(),
  userId: S.positive()(S.number),
  isSpecialDiet: S.boolean
})

export type MealsOnlyUserReservation = S.To<typeof MealsOnlyUserReservation>
