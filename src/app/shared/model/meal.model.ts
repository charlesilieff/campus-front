export interface IMeal {
  id?: number | null
  date?: string
  specialLunch?: number | null
  specialDinner?: number | null
  regularLunch?: number | null
  regularDinner?: number | null
  comment?: string | null
  breakfast?: number | null
}

export const defaultValue: Readonly<IMeal> = {}
