import { IReservation } from 'app/shared/model/reservation.model'

export interface ICustomer {
  id?: number
  firstname?: string
  lastname?: string
  age?: number | null
  phoneNumber?: string
  email?: string
  comment?: string | null
  reservations?: IReservation[] | null
}

export const defaultValue: Readonly<ICustomer> = {}
