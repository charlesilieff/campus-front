import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import { string } from 'fp-ts'
import * as Ord from 'fp-ts/Ord'

const Room = S.struct({
  id: S.number,
  name: S.string,
  comment: S.optional(S.string).toOption()
})

export const Bed = S.struct({
  id: S.number,
  kind: S.string,
  number: S.string,
  numberOfPlaces: S.number,
  room: S.optional(Room).toOption(),
  archive: S.optional(S.boolean).toOption()
})
export type Bed = S.To<typeof Bed>
export const ordBedByNumber = Ord.contramap((b: Bed) => b.number)(string.Ord)
export const bedDefaultValue: Readonly<O.Option<Bed>> = O.none()

export const BedCreate = S.struct({
  id: S.optional(S.number).toOption(),
  kind: S.string,
  number: S.string,
  numberOfPlaces: S.number,
  roomId: S.optional(S.number).toOption()
})
export type BedCreate = S.To<typeof BedCreate>
