import type { IPricing } from './pricing.model'

export interface ITypeReservation {
  id?: number
  name?: string
  comment?: string
  pricing?: IPricing[] | null
}

export const defaultValue: Readonly<ITypeReservation> = {}
