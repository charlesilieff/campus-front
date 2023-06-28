import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as S from '@effect/schema/Schema'
import type { Customer } from 'app/shared/model/customer.model'
import type { MealsOnlyUserReservation } from 'app/shared/model/mealsReservation.model'
import type { OneBedUserReservation } from 'app/shared/model/onebedReservation.model'
import { Place as PlaceImage } from 'app/shared/model/place.model'
import type { TypeReservation } from 'app/shared/model/typeReservation.model'
import type { UserCategory } from 'app/shared/model/userCategory.model'
import { getHttpEntities, getHttpEntity } from 'app/shared/util/httpUtils'
import axios from 'axios'
import dayjs from 'dayjs'

import { PlaceWithRooms } from '../planning/model'
import type {
  MealsOnlyReservationDatesAndMeals,
  OneBedReservationDatesAndMeals
} from './models/OneBedReservationDatesAndMeals'
import type { PlaceEncoded } from './models/Place'
import { Place } from './models/Place'

const apiUrlAllPlaces = 'api/planning/places'

export const getOnePlace = async (id: number | string): Promise<O.Option<PlaceImage>> => {
  const requestUrl = `${apiUrlAllPlaces}/${id}`

  return await getHttpEntity(requestUrl, PlaceImage)
}

export const getPlacesWithoutImage = async (): Promise<ReadonlyArray<PlaceEncoded>> => {
  const apiUrlPlacesWithoutImage = 'api/places/noimage'
  const requestUrl = `${apiUrlPlacesWithoutImage}?cacheBuster=${new Date().getTime()}`
  const { data } = await axios.get<PlaceEncoded[]>(requestUrl)

  return data
}

export const filterBedPlace =
  (places: ReadonlyArray<PlaceEncoded>) => (idPlace: number): ReadonlyArray<PlaceEncoded> => {
    if (isNaN(idPlace) || idPlace === 0) {
      return places?.flatMap(place => place.rooms)
    } else {
      return places
        ?.filter(place => place.id === idPlace)
        ?.flatMap(place => place.rooms)
    }
  }

export const filterBedRoomKind = (
  places: ReadonlyArray<PlaceEncoded>,
  idRoomKind: number
): ReadonlyArray<PlaceEncoded> => {
  if (isNaN(idRoomKind)) {
    return places?.flatMap(place => place.rooms)
  } else {
    return places
      ?.flatMap(place => place.rooms)
      .filter(room => room.bedroomKind?.id === idRoomKind)
  }
}

export interface IPricing { // WithReservation
  id?: number
  comment?: string | null
  userCategory?: UserCategory | null
  typeReservation?: TypeReservation | null
}

export const getPlaceWithFreeBedsAndBookedBeds = (isIntermittent: boolean) =>
async (
  arrivalDate: Date,
  departureDate: Date,
  reservationId: O.Option<string>
): Promise<ReadonlyArray<Place>> => {
  const apiUrlPlaces = `api/bookingbeds/${isIntermittent ? 'intermittent/' : ''}${
    arrivalDate.toISOString().slice(0, 10)
  }/${departureDate.toISOString().slice(0, 10)}${
    O.isSome(reservationId) ? `/${reservationId.value}` : ''
  }`

  const data = await getHttpEntities(apiUrlPlaces, Place)

  data.forEach(place => place.rooms.sort((room1, room2) => room1.name.localeCompare(room2.name)))
  return data
}

export const getIntermittentPlaceWithFreeAndBookedBeds = getPlaceWithFreeBedsAndBookedBeds(true)

export const isArrivalDateIsBeforeDepartureDate = (
  arrivalDate: Date,
  departureDate: Date
): boolean => dayjs(arrivalDate).isBefore(dayjs(departureDate))

export const isArrivalDateEqualDepartureDate = (arrivalDate: Date, departureDate: Date): boolean =>
  dayjs(arrivalDate).isSame(dayjs(departureDate))

export const isDateBeforeNow = (date: Date): boolean => dayjs(date).isBefore(dayjs())

export const createUserOneBedReservation = (
  customer: Customer,
  datesAndMeals: OneBedReservationDatesAndMeals,
  bedId: O.Option<number>,
  userId: number
): OneBedUserReservation => ({
  id: O.none(),
  userId,
  arrivalDate: datesAndMeals.arrivalDate,
  departureDate: datesAndMeals.departureDate,
  isSpecialDiet: datesAndMeals.isSpecialDiet === 'true',
  isArrivalLunch: datesAndMeals.isArrivalLunch,
  isArrivalDinner: datesAndMeals.isArrivalDinner,
  isDepartureLunch: datesAndMeals.isDepartureLunch,
  isDepartureDinner: datesAndMeals.isDepartureDinner,
  comment: datesAndMeals.comment,
  bedId,
  customer: {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    age: customer.age,
    comment: customer.comment
  },
  isArrivalBreakfast: datesAndMeals.isArrivalBreakfast,
  isDepartureBreakfast: datesAndMeals.isDepartureBreakfast,
  commentMeals: datesAndMeals.commentMeals
})

export const createUserMealsOnlyReservation = (
  customer: Customer,
  datesAndMeals: MealsOnlyReservationDatesAndMeals,
  userId: number
): MealsOnlyUserReservation => ({
  reservationId: O.none(),
  userId,
  arrivalDate: datesAndMeals.arrivalDate,
  departureDate: datesAndMeals.departureDate,
  isSpecialDiet: datesAndMeals.isSpecialDiet === 'true',

  comment: O.some(datesAndMeals.comment),

  customer: {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    age: customer.age,
    comment: customer.comment
  },
  weekMeals: datesAndMeals.weekMeals,
  commentMeals: O.some(datesAndMeals.commentMeals)
})
