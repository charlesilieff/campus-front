import type { BedEncoded } from 'app/shared/model/bed.model'
import type { CustomerEncoded } from 'app/shared/model/customer.model'
import type { IPricing } from 'app/shared/model/pricing.model'

// import type { IUserCategory } from './userCategory.model'

export interface IReservation {
  id?: number
  personNumber?: number
  paymentMode?: string | null
  isPaid?: boolean
  isConfirmed?: boolean
  reservationNumber?: string | null
  specialDietNumber?: number
  isArrivalDiner?: boolean
  isDepartureDiner?: boolean
  isArrivalLunch?: boolean
  isDepartureLunch?: boolean
  arrivalDate?: Date
  departureDate?: Date
  comment?: string | null
  pricing?: IPricing | null
  beds?: BedEncoded[] | null
  customer?: CustomerEncoded | null
  rooms?: string[]
  // userCategory?: IUserCategory | null
  userCategoryId?: number
  isArrivalBreakfast?: boolean
  isDepartureBreakfast?: boolean
  commentMeals?: string | null
}

export const defaultValue: Readonly<IReservation> = {
  isPaid: false,
  isConfirmed: false,
  isArrivalDiner: true,
  isDepartureDiner: false,
  isArrivalLunch: true,
  isDepartureLunch: true
}
