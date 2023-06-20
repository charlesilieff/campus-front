import type * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'

import { FormatLocalDate } from './formatLocalDate'

type Authorities =
  | 'ROLE_USER'
  | 'ROLE_ADMIN'
  | 'ROLE_RESPHEBERGEMENT'
  | 'ROLE_INTERMITTENT'
  | 'ROLE_HABITANT'
  | 'ROLE_EMPLOYEE'

export interface UserEncoded {
  id: number
  login: string
  firstName?: string
  lastName?: string
  email: string
  imageUrl?: string
  activated: boolean
  langKey: string
  createdBy: string
  createdDate?: string
  lastModifiedBy: string
  lastModifiedDate?: string
  authorities: readonly Authorities[]
  customerId?: number
  receiveMailReservation?: boolean
}

export interface UserDecoded {
  id: number
  login: string
  firstName: O.Option<string>
  lastName: O.Option<string>
  email: string
  imageUrl: O.Option<string>
  activated: boolean
  langKey: string
  createdBy: string
  createdDate: O.Option<Date>
  lastModifiedBy: string
  lastModifiedDate: O.Option<Date>
  authorities: readonly Authorities[]
  customerId: O.Option<number>
  receiveMailReservation: O.Option<boolean>
}

export const Authorities: S.Schema<Authorities, Authorities> = S.union(
  S.literal(
    'ROLE_USER',
    'ROLE_ADMIN',
    'ROLE_RESPHEBERGEMENT',
    'ROLE_INTERMITTENT',
    'ROLE_HABITANT',
    'ROLE_EMPLOYEE'
  )
)

export const User: S.Schema<UserEncoded, UserDecoded> = S.struct({
  id: S.number,
  login: S.string,
  firstName: S.optional(S.string).toOption(),
  lastName: S.optional(S.string).toOption(),
  email: S.string,
  imageUrl: S.optional(S.string).toOption(),
  activated: S.boolean,
  langKey: S.string,
  createdBy: S.string,
  createdDate: S.optional(FormatLocalDate).toOption(),
  lastModifiedBy: S.string,
  lastModifiedDate: S.optional(FormatLocalDate).toOption(),
  authorities: S.array(Authorities),
  customerId: S.optional(S.number).toOption(),
  receiveMailReservation: S.optional(S.boolean).toOption()
})

export type User = S.To<typeof User>
