import dayjs from 'dayjs'

export interface IMeal {
  id?: number | null
  date?: string
  specialLunch?: number | null
  specialDinner?: number | null
  regularLunch?: number | null
  regularDinner?: number | null
  specialLunchToCook?: number | null
  specialDinnerToCook?: number | null
  regularLunchToCook?: number | null
  regularDinnerToCook?: number | null
  comment?: string | null
}

export const defaultValue: Readonly<IMeal> = {}
