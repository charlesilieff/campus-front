import type { IBed } from 'app/shared/model/bed.model'
import type { BedroomKind } from 'app/shared/model/bedroom-kind.model'

import type { IPlace } from './place.model'

export interface IRoom {
  id?: number
  name?: string
  comment?: string | null
  beds?: IBed[] | null
  bedroomKind?: BedroomKind | null
  place?: IPlace | null
}

export const defaultValue: Readonly<IRoom> = {}
