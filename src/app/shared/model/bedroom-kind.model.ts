import * as S from '@effect/schema/Schema'

export const BedroomKindCreate = S.struct({
  id: S.optional(S.number).toOption(),
  name: S.string,
  description: S.optional(S.string).toOption()
})

export type BedroomKindCreate = S.Schema.To<typeof BedroomKindCreate>

export const BedroomKind = S.struct({
  id: S.number,
  name: S.string,
  description: S.optional(S.string).toOption()
})

export type BedroomKind = S.Schema.To<typeof BedroomKind>

export type BedroomKindEncoded = S.Schema.From<typeof BedroomKind>
