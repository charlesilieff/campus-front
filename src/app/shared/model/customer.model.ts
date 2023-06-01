import * as S from '@effect/schema/Schema'

export type ICustomer = S.To<typeof CustomerSchema>

export const CustomerSchema = S.struct({
  id: S.optional(S.number),
  firstname: S.optional(S.string),
  lastname: S.optional(S.string),
  age: S.optional(S.number),
  phoneNumber: S.optional(S.string),
  email: S.optional(S.string),
  comment: S.optional(S.string)
})

export const defaultValue: Readonly<ICustomer> = {}
