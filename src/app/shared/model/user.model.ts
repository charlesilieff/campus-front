import * as S from '@effect/schema/Schema'
import { Option as O } from 'effect'

import { FormatLocalDateTime } from './formatLocalDate'

export const Authorities = S.literal(
  'ROLE_USER',
  'ROLE_ADMIN',
  'ROLE_RESPHEBERGEMENT',
  'ROLE_INTERMITTENT',
  'ROLE_HABITANT',
  'ROLE_EMPLOYEE'
)

export type Authorities = S.Schema.To<typeof Authorities>

// {firstName : undefined,id: 1}
// {firstName : "",id: 1}
// {id: 1}
// => {id: 1, firstName: O.none()}

export const NonEmptyString = S.transform(
  S.union(S.string, S.undefined),
  S.option(S.string),
  s => {
    console.log('NonEmptyString', s === undefined || s.length === 0)
    return s === undefined || s.length === 0 ? O.none() : O.some(s)
  },
  b => {
    console.log('NonEmptyString encode', b)
    return b._tag === 'None' ? undefined : b
  }
)

export const User = S.struct({
  createdDate: S.optional(FormatLocalDateTime).toOption(),
  id: S.optional(S.number).toOption(),
  login: S.string,
  firstName: S.optional(S.string).toOption(),
  lastName: S.optional(S.string).toOption(),
  email: S.string,
  imageUrl: S.optional(S.string).toOption(),
  activated: S.boolean,
  langKey: S.string,
  createdBy: S.string,
  lastModifiedBy: S.string,
  lastModifiedDate: S.optional(FormatLocalDateTime).toOption(),
  authorities: S.array(Authorities),
  customerId: S.optional(S.number).toOption(),
  receiveMailReservation: S.optional(S.boolean).toOption()
})

export type UserEncoded = S.Schema.From<typeof User>
export type User = S.Schema.To<typeof User>
