import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import type { BedroomKindDecoded, BedroomKindEncoded } from 'app/shared/model/bedroom-kind.model'
import { BedroomKind } from 'app/shared/model/bedroom-kind.model'

import type { BedDecoded, BedEncoded } from './bed.model'
import { Bed } from './bed.model'

export interface RoomDecoded {
  id: number
  name: string
  comment: O.Option<string>
  beds: readonly BedDecoded[]
  bedroomKind: O.Option<BedroomKindDecoded>
}

export interface RoomEncoded {
  id: number
  name: string
  comment?: string
  beds: readonly BedEncoded[]
  bedroomKind?: BedroomKindEncoded
}

export const Room: S.Schema<RoomEncoded, RoomDecoded> = S.lazy(() =>
  S.struct({
    id: S.number,
    name: S.string,
    comment: S.optional(S.string).toOption(),
    beds: S.array(Bed),
    bedroomKind: S.optional(BedroomKind).toOption()
    // place: S.optional(Place).toOption()
  })
)

export type Room = S.To<typeof Room>

export const defaultValue: Readonly<O.Option<Room>> = O.none()
