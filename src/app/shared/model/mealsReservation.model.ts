import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

import type { ICustomer } from './customer.model'
import { CustomerSchema } from './customer.model'

export interface MealsOnlyUserReservation {
  reservationId: O.Option<number>
  arrivalDate: Date
  departureDate: Date
  weekMeals: {
    monday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    tuesday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    wednesday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    thursday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    friday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    saturday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
    sunday: { isBreakfast: boolean; isLunch: boolean; isDinner: boolean }
  }
  customer: ICustomer
  comment: O.Option<string>
  commentMeals: O.Option<string>
  userId: number
  isSpecialDiet: boolean
}

export const MealsOnlyUserReservation = S.struct({
  reservationId: S.optional(S.number).toOption(),
  arrivalDate: S.Date,
  departureDate: S.Date,
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
