import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

export interface BedroomKindDecoded {
  id: O.Option<number>
  name: string
  description: O.Option<string>
}

export interface BedroomKindEncoded {
  id?: number
  name: string
  description?: string
}

export const BedroomKind: S.Schema<BedroomKindEncoded, BedroomKindDecoded> = S.struct({
  id: S.optional(S.number).toOption(),
  name: S.string,
  description: S.optional(S.string).toOption()
})

export const BedroomKindDecodedToDecoded = S
  .struct({
    id: S.option(S.number),
    name: S.string,
    description: S.option(S.string)
  })

export type BedroomKind = S.To<typeof BedroomKind>
