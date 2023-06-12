import * as S from '@effect/schema/Schema'

export const BedroomKind = S.struct({
  id: S.optional(S.number).toOption(),
  name: S.string,
  description: S.optional(S.string).toOption()
})

export type BedroomKind = S.To<typeof BedroomKind>
