import * as S from '@effect/schema/Schema'
import type { Option as O } from 'effect'

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
