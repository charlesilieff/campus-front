import * as S from '@effect/schema/Schema'

import { CustomerSchema } from './customer.model'

export const MealsOnlyUserReservation = S.struct({
  reservationId: S.optional(S.number).toOption(),
  arrivalDate: S.string,
  departureDate: S.string,
  weekMeals: S.struct({
    monday: S.struct({
      isBreakfast: S.boolean,
      isLunch: S.boolean,
      isDinner: S.boolean
    }),
    tuesday: S.struct({
      isBreakfast: S.boolean,
      isLunch: S.boolean,
      isDinner: S.boolean
    }),
    wednesday: S.struct({
      isBreakfast: S.boolean,
      isLunch: S.boolean,
      isDinner: S.boolean
    }),
    thursday: S.struct({
      isBreakfast: S.boolean,
      isLunch: S.boolean,
      isDinner: S.boolean
    }),
    friday: S.struct({
      isBreakfast: S.boolean,
      isLunch: S.boolean,
      isDinner: S.boolean
    }),
    saturday: S.struct({
      isBreakfast: S.boolean,
      isLunch: S.boolean,
      isDinner: S.boolean
    }),
    sunday: S.struct({
      isBreakfast: S.boolean,
      isLunch: S.boolean,
      isDinner: S.boolean
    })
  }),
  customer: CustomerSchema,
  comment: S.optional(S.string).toOption(),
  commentMeals: S.optional(S.string).toOption(),
  userId: S.positive()(S.number),
  isSpecialDiet: S.boolean
})

export type MealsOnlyUserReservation = S.To<typeof MealsOnlyUserReservation>
