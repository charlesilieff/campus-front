import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import type { IBedroomKind } from 'app/shared/model/bedroom-kind.model'
import type { ITypeReservation } from 'app/shared/model/typeReservation.model'
import type { IUserCategory } from 'app/shared/model/userCategory.model'
import axios from 'axios'
import dayjs from 'dayjs'

const apiUrlAllPlaces = 'api/planning/places'

export const getOnePlace = async (id: number | string): Promise<IPlace> => {
  const requestUrl = `${apiUrlAllPlaces}/${id}?cacheBuster=${new Date().getTime()}`
  const { data } = await axios.get<IPlace>(requestUrl)
  return data
}

export const getPlacesWithoutImage = async (): Promise<ReadonlyArray<IPlace>> => {
  const apiUrlPlacesWithoutImage = 'api/places/noimage'
  const requestUrl = `${apiUrlPlacesWithoutImage}?cacheBuster=${new Date().getTime()}`
  const { data } = await axios.get<IPlace[]>(requestUrl)

  return data
}

export const filterBedPlace =
  (places: ReadonlyArray<IPlace>) => (idPlace: number): ReadonlyArray<IPlace> => {
    if (isNaN(idPlace) || idPlace === 0) {
      return places?.flatMap(place => place.rooms)
    } else {
      return places
        ?.filter(place => place.id === idPlace)
        ?.flatMap(place => place.rooms)
    }
  }

export const filterBedRoomKind = (
  places: ReadonlyArray<IPlace>,
  idRoomKind: number
): ReadonlyArray<IPlace> => {
  if (isNaN(idRoomKind)) {
    return places?.flatMap(place => place.rooms)
  } else {
    return places
      ?.flatMap(place => place.rooms)
      .filter(room => room.bedroomKind?.id === idRoomKind)
  }
}

export interface IPlace {
  id?: number
  name?: string
  comment?: string | null
  imageContentType?: string | null
  image?: string | null
  rooms?: IRoomWithBeds[] | null
  intermittentAllowed?: boolean
}

export interface IRoomWithBeds {
  id?: number
  name?: string
  comment?: string | null
  beds?: IBedWithStatus[] | null
  bedroomKind?: IBedroomKind | null
  place?: IPlace | null
}

export interface IPricing { // WithReservation
  id?: number
  comment?: string | null
  userCategory?: IUserCategory | null
  typeReservation?: ITypeReservation | null
}

export interface IBedWithStatus {
  id?: number
  kind?: string
  number?: string
  numberOfPlaces?: number
  booked: boolean
}

export const getPlaceWithFreeBedsAndBookedBeds = (isIntermittent: boolean) =>
async (
  arrivalDate: string,
  departureDate: string,
  reservationId: O.Option<string>
): Promise<ReadonlyArray<IPlace>> => {
  const apiUrlPlaces = `api/bookingbeds/${
    isIntermittent ? 'intermittent/' : ''
  }${arrivalDate}/${departureDate}${O.isSome(reservationId) ? `/${reservationId.value}` : ''}`

  const { data } = await axios.get<IPlace[]>(apiUrlPlaces)

  data.forEach(place => place.rooms.sort((room1, room2) => room1.name.localeCompare(room2.name)))
  return data
}

export const getIntermittentPlaceWithFreeAndBookedBeds = getPlaceWithFreeBedsAndBookedBeds(true)

export const isArrivalDateIsBeforeDepartureDate = (d1: string, d2: string): boolean => {
  const arrivalDate = pipe(
    d1 === '' ? O.none() : O.some(d1),
    O.map(d => dayjs(d))
  )
  const departureDate = pipe(
    d2 === '' ? O.none() : O.some(d2),
    O.map(d => dayjs(d))
  )
  return pipe(
    O.struct({ arrivalDate, departureDate }),
    O.map(d => d.arrivalDate.isBefore(d.departureDate)),
    O.exists(x => x)
  )
}

export const isDateBeforeNow = (date: string): boolean => {
  const dateToCheck = pipe(
    date === '' ? O.none() : O.some(date),
    O.map(d => dayjs(d))
  )
  return pipe(
    dateToCheck,
    O.map(d => d.isBefore(dayjs())),
    O.exists(x => x)
  )
}
