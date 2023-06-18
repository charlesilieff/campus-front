import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

export interface CustomerEncoded {
  id?: number
  firstname: string
  lastname: string
  age?: number
  phoneNumber?: string
  email: string
  comment?: string
}

export interface CustomerDecoded {
  id: O.Option<number>
  firstname: string
  lastname: string
  age: O.Option<number>
  phoneNumber: O.Option<string>
  email: string
  comment: O.Option<string>
}

export const Customer: S.Schema<CustomerEncoded, CustomerDecoded> = S.struct({
  id: S.optional(S.number).toOption(),
  firstname: S.string,
  lastname: S.string,
  age: S.optional(S.number).toOption(),
  phoneNumber: S.optional(S.string).toOption(),
  email: S.string,
  comment: S.optional(S.string).toOption()
})

export type Customer = S.To<typeof Customer>
