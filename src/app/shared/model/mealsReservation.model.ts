import type * as O from '@effect/data/Option'

import type { ICustomer } from './customer.model'

export interface MealsOnlyUserReservation {
  id: O.Option<number>
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
  bedId: O.Option<number>
  comment: string
  commentMeals: string
  userId: number
}
