import { ICustomer } from 'app/shared/model/customer.model'

export interface IReservationsPlanning {
  id: number
  isPaid: boolean
  isConfirmed: boolean
  personNumber: number
  customer: ICustomer
  firstname: string
  lastname: string
  age: number
  isFemal: boolean
  phoneNumber: number
  email: string
  comment: string
  arrivalDate: Date
  departureDate: Date
  bedsId: number[]
}
