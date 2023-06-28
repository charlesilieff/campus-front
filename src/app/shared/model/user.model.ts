import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

import { FormatLocalDateTime } from './formatLocalDate'

export const Authorities = S.literal(
  'ROLE_USER',
  'ROLE_ADMIN',
  'ROLE_RESPHEBERGEMENT',
  'ROLE_INTERMITTENT',
  'ROLE_HABITANT',
  'ROLE_EMPLOYEE'
)

export type Authorities = S.To<typeof Authorities>

// {firstName : undefined,id: 1}
// {firstName : "",id: 1}
// {id: 1}
// => {id: 1, firstName: O.none()}

export const NonEmptyString = S.optional(S.transform(
  S.union(S.string, S.undefined),
  S.option(S.string),
  s => s === undefined || s.length === 0 ? O.none() : O.some(s),
  // define a function that converts a Date into a string
  b => b._tag === 'None' ? undefined : b.value
))

export const User = S.struct({
  createdDate: S.optional(FormatLocalDateTime).toOption(),
  id: S.optional(S.number).toOption(),
  login: S.string,
  firstName: NonEmptyString,
  lastName: NonEmptyString,
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

export type UserEncoded = S.From<typeof User>
export type User = S.To<typeof User>
