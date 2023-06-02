export interface IUser {
  id?: number | null
  login?: string
  firstName?: string
  lastName?: string
  email?: string
  activated?: boolean
  langKey?: string
  authorities: string[]
  createdBy?: string
  createdDate?: Date | null
  lastModifiedBy?: string
  lastModifiedDate?: Date | null
  password?: string
  customerId?: number | null
  receiveMailReservation?: boolean
}

export const defaultValue: Readonly<IUser> = {
  id: null,
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
  customerId: null,
  receiveMailReservation: true
}
