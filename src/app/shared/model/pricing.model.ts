// import type { IReservation } from 'app/shared/model/reservation.model'
import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import type { UserCategoryEncoded } from 'app/shared/model/userCategory.model'
import { UserCategory } from 'app/shared/model/userCategory.model'

import type { TypeReservationEncoded } from './typeReservation.model'
import { TypeReservation } from './typeReservation.model'

export interface PricingEncoded {
  id: number
  price: number
  comment?: string
  typeReservation?: TypeReservationEncoded
  userCategory?: UserCategoryEncoded
}

export interface Pricing {
  id: number
  price: number
  comment: O.Option<string>
  typeReservation: O.Option<TypeReservation>
  userCategory: O.Option<UserCategory>
}

export const Pricing: S.Schema<PricingEncoded, Pricing> = S.lazy(() =>
  S.struct({
    id: S.number,
    price: S.number,
    comment: S.optional(S.string).toOption(),
    typeReservation: S.optional(TypeReservation).toOption(),
    userCategory: S.optional(UserCategory).toOption()
  })
)

export interface PricingCreateEncoded {
  id: number
  price: number
  comment?: string
  typeReservationId?: number
  userCategoryId?: number
}

export interface PricingCreate {
  id: number
  price: number
  comment: O.Option<string>
  typeReservationId: O.Option<number>
  userCategoryId: O.Option<number>
}

export const PricingCreate: S.Schema<PricingCreateEncoded, PricingCreate> = S.struct({
  id: S.number,
  price: S.number,
  comment: S.optional(S.string).toOption(),
  typeReservationId: S.optional(S.number).toOption(),
  userCategoryId: S.optional(S.number).toOption()
})
