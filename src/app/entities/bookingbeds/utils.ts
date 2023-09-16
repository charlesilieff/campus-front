import type { Customer } from 'app/shared/model/customer.model'
import type { MealsOnlyUserReservation } from 'app/shared/model/mealsReservation.model'
import type { OneBedUserReservation } from 'app/shared/model/onebedReservation.model'
import type { TypeReservation } from 'app/shared/model/typeReservation.model'
import type { UserCategory } from 'app/shared/model/userCategory.model'
import { getHttpEntities, getHttpEntity } from 'app/shared/util/httpUtils'
import axios from 'axios'
import dayjs from 'dayjs'
import { Option as O } from 'effect'
import { ReadonlyArray as A } from 'effect'
import { pipe } from 'effect'

import { PlaceWithRooms } from '../planning/model'
import type {
  MealsOnlyReservationDatesAndMeals,
  OneBedReservationDatesAndMeals
} from './models/OneBedReservationDatesAndMeals'
import type { PlaceEncoded } from './models/Place'
import { Place } from './models/Place'
import type { RoomWithBedsWithStatus } from './models/Room'

const apiUrlAllPlaces = 'api/planning/places'

export const getOnePlace = async (id: number | string): Promise<O.Option<PlaceWithRooms>> => {
  const requestUrl = `${apiUrlAllPlaces}/${id}`

  return await getHttpEntity(requestUrl, PlaceWithRooms)
}

export const getPlacesWithoutImage = async (): Promise<ReadonlyArray<PlaceEncoded>> => {
  const apiUrlPlacesWithoutImage = 'api/places/noimage'
  const requestUrl = `${apiUrlPlacesWithoutImage}?cacheBuster=${new Date().getTime()}`
  const { data } = await axios.get<PlaceEncoded[]>(requestUrl)

  return data
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
  arrivalDate: Date | string,
  departureDate: Date | string
): boolean => dayjs(arrivalDate).isBefore(dayjs(departureDate))

export const isArrivalDateEqualDepartureDate = (
  arrivalDate: Date | string,
  departureDate: Date | string
): boolean => dayjs(arrivalDate).isSame(dayjs(departureDate))

export const isDateBeforeNow = (date: Date | string): boolean => dayjs(date).isBefore(dayjs())

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
    firstName: customer.firstName,
    lastName: customer.lastName,
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

  comment: datesAndMeals.comment,

  customer: {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    age: customer.age,
    comment: customer.comment
  },
  weekMeals: datesAndMeals.weekMeals,
  commentMeals: datesAndMeals.commentMeals
})

export const filterRoomsByBedRoomKind = (
  idRoomKind: O.Option<number>,
  places: readonly Place[]
): RoomWithBedsWithStatus[] =>
  (O.isNone(idRoomKind)) ? places.flatMap(place => place.rooms) : pipe(
    places,
    A.flatMap(place => place.rooms),
    A.filter(room =>
      pipe(
        room.bedroomKind,
        O.map(r => r.id),
        O.contains(idRoomKind.value)
      )
    )
  )

export const filterBedPlace = (
  idPlace: O.Option<number>,
  places: readonly Place[]
): RoomWithBedsWithStatus[] =>
  O.isNone(idPlace) ?
    places?.flatMap(place => place.rooms) :
    places.filter(place => place.id === idPlace.value).flatMap(place => place.rooms)
