import * as S from '@effect/schema/Schema'
import type { BedCreateDecoded, BedCreateEncoded } from 'app/shared/model/bed.model'
import { BedCreate } from 'app/shared/model/bed.model'
import type { Option as O } from 'effect'
import { pipe } from 'effect'

export interface RoomDecodedPlanning {
  id: number
  name: string
  comment: O.Option<string>
  beds: readonly Omit<BedCreateDecoded, 'kind' | 'numberOfPlaces'>[]
  // bedroomKind: O.Option<BedroomKindDecoded>
  // place: O.Option<PlaceDecoded>
}

export interface RoomEncodedPlanning {
  id: number
  name: string
  comment?: string
  beds: readonly Omit<BedCreateEncoded, 'kind' | 'numberOfPlaces'>[]
  // bedroomKind?: BedroomKindEncoded
  // place?: PlaceEncoded
}

const RoomS: S.Schema<RoomEncodedPlanning, RoomDecodedPlanning> = S.struct({
  id: S.number,
  name: S.string,
  comment: S.optional(S.string).toOption(),
  beds: S.array(pipe(BedCreate, S.omit('kind', 'numberOfPlaces')))
})

export const PlaceWithRooms = pipe(
  S.struct({
    id: S.number,
    name: S.string,
    comment: S.optional(S.string).toOption(),
    imageContentType: S.optional(S.string).toOption(),
    image: S.optional(S.string).toOption(),
    intermittentAllowed: S.optional(S.boolean).toOption(),
    rooms: S.array(RoomS)
  })
)

export type PlaceWithRooms = S.To<typeof PlaceWithRooms>
