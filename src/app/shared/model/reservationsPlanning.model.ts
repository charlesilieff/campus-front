import type { CustomerEncoded } from 'app/shared/model/customer.model'

export type ReservationStatus = 'pending' | 'processed' | 'urgent'

export interface IReservationsPlanning {
  id: number
  isPaid: boolean
  isConfirmed: boolean
  personNumber: number
  customer: CustomerEncoded
  firstname: string
  lastname: string
  age: number
  phoneNumber: number
  email: string
  comment: string
  arrivalDate: Date
  departureDate: Date
  bedsId: number[]
  status: ReservationStatus
}
