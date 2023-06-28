import * as S from '@effect/schema/Schema'

import { RoomWithBedsWithStatus } from './Room'

export const Place = S.struct({
  id: S.number,
  name: S.string,
  rooms: S.array(RoomWithBedsWithStatus)
})

export type PlaceEncoded = S.From<typeof Place>
export type Place = S.To<typeof Place>
