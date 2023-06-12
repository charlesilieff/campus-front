import type { IReservation } from 'app/shared/model/reservation.model'
import type { IRoom } from 'app/shared/model/room.model'

// export const BedSchema = S.struct({
//   id: S.number,
//   kind: S.string,
//   number: S.string,
//   numberOfPlaces: S.number,
//   room: S.option(RoomSchema),
//   archive: S.option(S.boolean),
// })

export interface IBed {
  id?: number
  kind?: string
  number?: string
  numberOfPlaces?: number
  room?: IRoom | null
  reservations?: IReservation[] | null
  archive?: boolean
}

export const defaultValue: Readonly<IBed> = {}
