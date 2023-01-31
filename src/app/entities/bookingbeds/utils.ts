import type { IPlace } from 'app/shared/model/place.model'
import axios from 'axios'

const apiUrlAllPlaces = 'api/planning/places'
const apiUrlPlacesWithoutImage = 'api/places/noimage'
export const getOnePlace = async (id: string): Promise<IPlace> => {
  const requestUrl = `${apiUrlAllPlaces}/${id}?cacheBuster=${new Date().getTime()}`
  const { data } = await axios.get<IPlace>(requestUrl)
  return data
}

export const getPlaces = async (): Promise<ReadonlyArray<IPlace>> => {
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
export const getPlaceWithFreeBeds = (isIntermittent: boolean) =>
async (
  arrivalDate: string,
  departureDate: string
): Promise<ReadonlyArray<IPlace>> => {
  const apiUrlPlaces = `api/bookingbeds/${
    isIntermittent ? 'intermittent/' : ''
  }${arrivalDate}/${departureDate}`
  const requestUrl = `${apiUrlPlaces}`
  const { data } = await axios.get<IPlace[]>(requestUrl)

  data.forEach(place => place.rooms.sort((room1, room2) => room1.name.localeCompare(room2.name)))
  return data
}

export const getIntermittentPlaceWithFreeBeds = getPlaceWithFreeBeds(true)
