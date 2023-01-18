export interface IPricing {
  id?: number
  wording?: string
  price?: number
  comment?: string | null
}

export const defaultValue: Readonly<IPricing> = {}
