export interface IPricing {
  id?: number
  // wording?: string
  price?: number
  comment?: string | null
  userCategoryId?: number
  typeReservationId?: number
}

export const defaultValue: Readonly<IPricing> = {}
