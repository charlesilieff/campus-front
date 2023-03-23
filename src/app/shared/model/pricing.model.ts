// import type { IReservation } from 'app/shared/model/reservation.model'
import type { ITypeReservation } from 'app/shared/model/typeReservation.model'
import type { IUserCategory } from 'app/shared/model/userCategory.model'

export interface IPricing {
  id?: number
  price?: number
  comment?: string | null
  // reservation?: IReservation[] | null
  typeReservation?: ITypeReservation | null
  userCategory?: IUserCategory | null
}

export const defaultValue: Readonly<IPricing> = {}
