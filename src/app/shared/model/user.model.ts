import * as O from '@effect-ts/core/Option'

export interface IUser {
  id?: any
  login?: string
  firstName?: string
  lastName?: string
  email?: string
  activated?: boolean
  langKey?: string
  authorities?: string[]
  createdBy?: string
  createdDate?: Date | null
  lastModifiedBy?: string
  lastModifiedDate?: Date | null
  password?: string
  customerId?: string
}

export const defaultValue: Readonly<IUser> = {
  id: '',
  login: '',
  firstName: '',
  lastName: '',
  email: '',
  activated: true,
  langKey: 'fr',
  authorities: [],
  createdBy: '',
  createdDate: null,
  lastModifiedBy: '',
  lastModifiedDate: null,
  password: '',
  customerId: null
}
