import { IBed } from 'app/shared/model/bed.model'
import { IBedroomKind } from 'app/shared/model/bedroom-kind.model'

import { IPlace } from './place.model'

export interface IRoom {
  id?: number
  name?: string
  comment?: string | null
  beds?: IBed[] | null
  bedroomKind?: IBedroomKind | null
  place?: IPlace | null
}

export const defaultValue: Readonly<IRoom> = {}
