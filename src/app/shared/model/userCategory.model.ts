import * as S from '@effect/schema/Schema'

import type { IPricing } from './pricing.model'

export interface IUserCategory {
  id?: number
  name?: string
  comment?: string
  pricing?: IPricing[] | null
}

export const UserCategorySchema = S.struct({
  id: S.number,
  name: S.string,
  comment: S.optional(S.string).toOption()
})

export type UserCategorySchema = S.To<typeof UserCategorySchema>

export const defaultValue: Readonly<IUserCategory> = {}
