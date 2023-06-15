import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import { BedroomKind } from 'app/shared/model/bedroom-kind.model'

import { Bed } from './bed.model'

export const Room = S.struct({
  id: S.number,
  name: S.string,
  comment: S.optional(S.string).toOption(),
  beds: S.array(Bed),
  bedroomKind: S.optional(BedroomKind).toOption()
  // place: S.optional(Place).toOption()
})

export type Room = S.To<typeof Room>

export const defaultValue: Readonly<O.Option<Room>> = O.none()
