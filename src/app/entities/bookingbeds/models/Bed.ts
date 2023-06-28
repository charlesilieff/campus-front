import { pipe } from '@effect/data/Function'
import * as S from '@effect/schema/Schema'

export const BedWithStatus = S.struct({
  id: S.number,
  kind: S.string,
  number: S.string,
  numberOfPlaces: S.number,
  booked: S.boolean
})

export const Bed = pipe(BedWithStatus, S.omit('booked'))

export type BedWithStatusEncoded = S.From<typeof BedWithStatus>
export type BedWithStatus = S.To<typeof BedWithStatus>
