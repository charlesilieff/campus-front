import type { ICustomer } from './customer.model'
import type { IPricing } from './pricing.model'

export interface IBookingBeds {
  id?: number
  firstname?: string
  lastname?: string
  age?: number
  phoneNumber?: string
  email?: string
  pricingId?: number
  arrivalDate?: Date
  departureDate?: Date
  customerComment?: string
  isArrivalDiner?: boolean
  isArrivalLunch?: boolean
  isDepartureDiner?: boolean
  isDepartureLunch?: boolean
  reservationComment?: string
  personNumber?: number
  specialDietNumber?: number
  customer?: ICustomer
  pricing?: IPricing
  isPaid?: boolean
  isConfirmed?: boolean
  paymentMode?: string
  bedIds: number[]
  comment?: string
}

export const defaultValue: Readonly<IBookingBeds> = {
  isPaid: false,
  isConfirmed: false,
  paymentMode: null,
  bedIds: []
}
