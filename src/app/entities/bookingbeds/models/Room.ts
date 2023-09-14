import * as S from '@effect/schema/Schema'
import { BedroomKind } from 'app/shared/model/bedroom-kind.model'

import { BedWithStatus } from './Bed'

export const RoomWithBedsWithStatus = S.struct({
  id: S.number,
  name: S.string,
  beds: S.array(BedWithStatus),
  bedroomKind: S.optional(BedroomKind).toOption()
})

export type RoomWithBedsEncodedWithStatus = S.Schema.From<typeof RoomWithBedsWithStatus>
export type RoomWithBedsWithStatus = S.Schema.To<typeof RoomWithBedsWithStatus>
