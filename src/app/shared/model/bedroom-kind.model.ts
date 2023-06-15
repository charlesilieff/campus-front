import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

export interface BedroomKindDecoded {
  id: O.Option<number>
  name: string
  description: O.Option<string>
}

export interface BedroomKindEncoded {
  id: number | null
  name: string
  description: string | null
}

export const BedroomKind: S.Schema<BedroomKindEncoded, BedroomKindDecoded> = S.struct({
  id: S.optionFromNullable(S.number),
  name: S.string,
  description: S.optionFromNullable(S.string)
})

export type BedroomKind = S.To<typeof BedroomKind>
