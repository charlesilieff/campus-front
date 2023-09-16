export interface IMealWithCustomer {
  breakfast?: number
  // date?: string | null

  regularLunch?: number
  regularDinner?: number
  commentMeals?: string | null // todo à garder pour detail repas speciaux
  specialLunch?: number
  specialDinner?: number
  firstName?: string | null
  lastName?: string | null
}

export const defaultValue: Readonly<IMealWithCustomer> = {}
