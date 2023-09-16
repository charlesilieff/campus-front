import * as S from '@effect/schema/Schema'
import type { Option as O } from 'effect'

export interface CustomerEncoded {
  id?: number
  firstName: string
  lastName: string
  age?: number
  phoneNumber?: string
  email: string
  comment?: string
}

export interface CustomerDecoded {
  id: O.Option<number>
  firstName: string
  lastName: string
  age: O.Option<number>
  phoneNumber: O.Option<string>
  email: string
  comment: O.Option<string>
}

export const Customer: S.Schema<CustomerEncoded, CustomerDecoded> = S.struct({
  id: S.optional(S.number).toOption(),
  firstName: S.string,
  lastName: S.string,
  age: S.optional(S.number).toOption(),
  phoneNumber: S.optional(S.string).toOption(),
  email: S.string,
  comment: S.optional(S.string).toOption()
})

export type Customer = S.Schema.To<typeof Customer>
