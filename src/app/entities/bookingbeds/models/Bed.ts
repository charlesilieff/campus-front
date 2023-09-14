import * as S from '@effect/schema/Schema'
import { pipe } from 'effect'

export const BedWithStatus = S.struct({
  id: S.number,
  kind: S.string,
  number: S.string,
  numberOfPlaces: S.number,
  booked: S.boolean
})

export const Bed = pipe(BedWithStatus, S.omit('booked'))

export type BedWithStatusEncoded = S.Schema.From<typeof BedWithStatus>
export type BedWithStatus = S.Schema.To<typeof BedWithStatus>
