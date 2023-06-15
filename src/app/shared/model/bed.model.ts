import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import { string } from 'fp-ts'
import * as Ord from 'fp-ts/Ord'

import type { RoomDecoded, RoomEncoded } from './room.model'
import { Room } from './room.model'

export interface BedDecoded {
  id: number
  kind: string
  number: string
  numberOfPlaces: number
  room: O.Option<RoomDecoded>
  archive: O.Option<boolean>
}

export interface BedEncoded {
  id: number
  kind: string
  number: string
  numberOfPlaces: number
  room?: RoomEncoded
  archive?: boolean
}

export const Bed: S.Schema<BedEncoded, BedDecoded> = S.lazy(() =>
  S.struct({
    id: S.number,
    kind: S.string,
    number: S.string,
    numberOfPlaces: S.number,
    room: S.optional(Room).toOption(),
    archive: S.optional(S.boolean).toOption()
  })
)

export type Bed = S.To<typeof Bed>

export const ordBedByNumber = Ord.contramap((b: Bed) => b.number)(string.Ord)
export const bedDefaultValue: Readonly<O.Option<Bed>> = O.none()

export interface BedCreateEncoded {
  id: number | null
  kind: string
  number: string
  numberOfPlaces: number
  roomId: number | null
}

export const BedCreate = S.struct({
  id: S.optionFromNullable(S.number),
  kind: S.string,
  number: S.string,
  numberOfPlaces: S.number,
  roomId: S.optionFromNullable(S.number)
})
export type BedCreate = S.To<typeof BedCreate>

// interface BedDecoded {
//   name: string
//   room: O.Option<RoomDecoded>
// }

// interface BedEncoded {
//   name: string
//   room: RoomEncoded | null
// }

// const Bed: S.Schema<BedEncoded,BedDecoded> = S.lazy(() =>
//   S.struct({
//     name: S.string,
//     room: S.optionFromNullable(Room)
//   })
// )
// // type Bed = S.To<typeof Bed>
// interface RoomEncoded {
//   name: string
//   beds: readonly BedEncoded[]
// }

// interface RoomDecoded {
//   name: string
//   beds: readonly BedDecoded[]
// }

// const Room: S.Schema<RoomEncoded,RoomDecoded> = S.lazy(() =>
//   S.struct({
//     name: S.string,
//     beds: S.array(Bed)
//   })
// )
