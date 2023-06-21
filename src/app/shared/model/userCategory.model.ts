import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

export interface UserCategoryEncoded {
  id: number
  name: string
  comment?: string
}

export interface UserCategory {
  id: number
  name: string
  comment: O.Option<string>
}
export const UserCategory: S.Schema<UserCategoryEncoded, UserCategory> = S.struct({
  id: S.number,
  name: S.string,
  comment: S.optional(S.string).toOption()
})
