import type { IPricing } from './pricing.model'

export interface IUserCategory {
  id?: number
  name?: string
  pricing?: IPricing[] | null
}

export const defaultValue: Readonly<IUserCategory> = {}
