import * as S from '@effect/schema/Schema'
import { Option as O, Order, pipe, String } from 'effect'

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

export const ordBedByNumber = Order.mapInput((b: Bed) => b.number)(String.Order)
export const bedDefaultValue: Readonly<O.Option<Bed>> = O.none()

export interface BedCreateEncoded {
  readonly id?: number
  readonly kind: string
  readonly number: string
  readonly numberOfPlaces: number
  readonly roomId?: number
}

export interface BedCreateDecoded {
  id: O.Option<number>
  kind: string
  number: string
  numberOfPlaces: number
  roomId: O.Option<number>
}

export const BedCreate: S.Schema<BedCreateEncoded, BedCreateDecoded> = S.struct({
  id: S.optional(S.number).toOption(),
  kind: pipe(
    S.string,
    S.filter(s => s.length > 2, {
      title: 'kind',
      message: () => 'Le type de lit doit être avoir au moins 3 caractères'
    }),
    S.filter(s => s.length < 20, {
      title: 'kind',
      message: () => 'Le type de lit doit être avoir au plus 20 caractères'
    })
  ),
  number: pipe(
    S.string,
    S.filter(s => s.length < 20, {
      title: 'kind',
      message: () => 'Le type de lit doit être avoir au plus 20 caractères'
    })
  ),
  numberOfPlaces: S.number,
  roomId: S.optional(S.number).toOption()
})
export type BedCreate = S.To<typeof BedCreate>
