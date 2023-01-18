import { IReservation } from 'app/shared/model/reservation.model'
import { IRoom } from 'app/shared/model/room.model'

export interface IBed {
  id?: number
  kind?: string
  number?: string
  numberOfPlaces?: number
  room?: IRoom | null
  reservations?: IReservation[] | null
}

export const defaultValue: Readonly<IBed> = {}
