export interface IMealWithCustomer {
  breakfast?: number
  // date?: string | null

  regularLunch?: number
  regularDinner?: number
  comment?: string | null // todo à garder pour detail repas speciaux
  specialLunch?: number
  specialDinner?: number
  firstname?: string | null
  lastname?: string | null
}

export const defaultValue: Readonly<IMealWithCustomer> = {}
