import * as S from '@effect/schema/Schema'
import type { BedroomKindEncoded } from 'app/shared/model/bedroom-kind.model'
import { BedroomKind } from 'app/shared/model/bedroom-kind.model'
import type { Option as O } from 'effect'
import { pipe } from 'effect'

import type { BedCreateDecoded, BedCreateEncoded } from './bed.model'
import { BedCreate } from './bed.model'
import type { PlaceDecoded, PlaceEncoded } from './place.model'
import { Place } from './place.model'

export interface RoomDecoded {
  id: number
  name: string
  comment: O.Option<string>
  beds: readonly Omit<BedCreateDecoded, 'kind' | 'numberOfPlaces'>[]
  bedroomKind: O.Option<BedroomKind>
  place: O.Option<PlaceDecoded>
}

export interface RoomEncoded {
  id: number
  name: string
  comment?: string
  beds: readonly Omit<BedCreateEncoded, 'kind' | 'numberOfPlaces'>[]
  bedroomKind?: BedroomKindEncoded
  place?: PlaceEncoded
}

export const Room: S.Schema<RoomEncoded, RoomDecoded> = S.lazy(() =>
  S.struct({
    id: S.number,
    name: S.string,
    comment: S.optional(S.string).toOption(),
    beds: S.array(pipe(BedCreate, S.omit('kind', 'numberOfPlaces'))),
    bedroomKind: S.optional(BedroomKind).toOption(),
    place: S.optional(Place).toOption()
  })
)

export type Room = S.To<typeof Room>

export interface RoomCreateDecoded {
  id: O.Option<number>
  name: string
  comment: O.Option<string>
  bedroomKindId: O.Option<number>
  placeId: O.Option<number>
}

export interface RoomCreateEncoded {
  id?: number
  name: string
  comment?: string
  bedroomKindId?: number
  placeId?: number
}

export const RoomCreate: S.Schema<RoomCreateEncoded, RoomCreateDecoded> = S.lazy(() =>
  S.struct({
    id: S.optional(S.number).toOption(),
    name: S.string,
    comment: S.optional(S.string).toOption(),
    bedroomKindId: S.optional(S.number).toOption(),
    placeId: S.optional(S.number).toOption()
  })
)
