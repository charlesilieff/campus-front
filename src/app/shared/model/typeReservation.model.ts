import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

import type { PricingEncoded } from './pricing.model'
import { Pricing } from './pricing.model'

export interface TypeReservationEncoded {
  id: number
  name: string
  comment?: string
  pricings: readonly PricingEncoded[]
}

export interface TypeReservation {
  id: number
  name: string
  comment: O.Option<string>
  pricings: readonly Pricing[]
}

export const TypeReservation: S.Schema<TypeReservationEncoded, TypeReservation> = S.lazy(() =>
  S.struct({
    id: S.number,
    name: S.string,
    comment: S.optional(S.string).toOption(),
    pricings: S.array(Pricing)
  })
)
