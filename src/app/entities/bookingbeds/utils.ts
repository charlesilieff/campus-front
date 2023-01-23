import * as A from '@effect-ts/core/Collections/Immutable/Array'
import { IPlace } from 'app/shared/model/place.model'
import axios from 'axios'

const apiUrlAllPlaces = 'api/planning/places'
const apiUrlPlacesWithoutImage = 'api/places/noimage'
export const getOnePlace = async (id: string): Promise<IPlace> => {
  const requestUrl = `${apiUrlAllPlaces}/${id}?cacheBuster=${new Date().getTime()}`
  const { data } = await axios.get<IPlace>(requestUrl)
  return data
}

export const getPlaces = async (): Promise<A.Array<IPlace>> => {
  const requestUrl = `${apiUrlPlacesWithoutImage}?cacheBuster=${new Date().getTime()}`
  const { data } = await axios.get<IPlace[]>(requestUrl)

  return data
}

export const filterBedPlace = (places: A.Array<IPlace>) => (idPlace: number): A.Array<IPlace> => {
  if (isNaN(idPlace) || idPlace === 0) {
    return places?.flatMap(place => {
      return place.rooms
    })
  } else {
    return places
      ?.filter(place => {
        return place.id === idPlace
      })
      ?.flatMap(place => {
        return place.rooms
      })
  }
}

export const filterBedRoomKind = (places: A.Array<IPlace>, idRoomKind: number): A.Array<IPlace> => {
  if (isNaN(idRoomKind)) {
    return places?.flatMap(place => {
      return place.rooms
    })
  } else {
    return places
      ?.flatMap(place => {
        return place.rooms
      })
      .filter(room => {
        return room.bedroomKind?.id === idRoomKind
      })
  }
}

export const getPlaceWithFreeBeds = async (
  arrivalDate: string,
  departureDate: string
): Promise<A.Array<IPlace>> => {
  const apiUrlPlaces = `api/bookingbeds/${arrivalDate}/${departureDate}`
  const requestUrl = `${apiUrlPlaces}`
  const { data } = await axios.get<IPlace[]>(requestUrl)

  data.forEach(place => place.rooms.sort((room1, room2) => room1.name.localeCompare(room2.name)))
  return data
}
