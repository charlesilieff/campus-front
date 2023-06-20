import * as S from '@effect/schema/Schema'

import { FormatLocalDateTime } from './formatLocalDate'

export const Authorities = S.union(
  S.literal(
    'ROLE_USER',
    'ROLE_ADMIN',
    'ROLE_RESPHEBERGEMENT',
    'ROLE_INTERMITTENT',
    'ROLE_HABITANT',
    'ROLE_EMPLOYEE'
  )
)
export type Authorities = S.To<typeof Authorities>

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
export type UserEncoded = S.From<typeof User>
export type User = S.To<typeof User>
