import * as O from '@effect/data/Option'
import type { BedroomKind } from 'app/shared/model/bedroom-kind.model'
import type { Customer } from 'app/shared/model/customer.model'
import type { MealsOnlyUserReservation } from 'app/shared/model/mealsReservation.model'
import type { OneBedUserReservation } from 'app/shared/model/onebedReservation.model'
import type { ITypeReservation } from 'app/shared/model/typeReservation.model'
import type { IUserCategory } from 'app/shared/model/userCategory.model'
import axios from 'axios'
import dayjs from 'dayjs'

import type { MealsOnlyReservationDatesAndMeals, OneBedReservationDatesAndMeals } from './models'

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
      // @ts-expect-error TODO: fix this
      return places?.flatMap(place => place.rooms)
    } else {
      // @ts-expect-error TODO: fix this
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
    // @ts-expect-error TODO: fix this
    return places?.flatMap(place => place.rooms)
  } else {
    // @ts-expect-error TODO: fix this
    return places
      ?.flatMap(place => place.rooms)
      // @ts-expect-error TODO: fix this
      .filter(room => room.bedroomKind?.id === idRoomKind)
  }
}

export interface IPlace {
  id?: number
  name?: string
  comment?: string | null
  imageContentType?: string | null
  image?: string | null
  rooms: IRoomWithBeds[] | null
  intermittentAllowed?: boolean
}

export interface IRoomWithBeds {
  id?: number
  name?: string
  comment?: string | null
  beds?: IBedWithStatus[] | null
  bedroomKind?: BedroomKind | null
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
  // @ts-expect-error TODO: fix this
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
  // @ts-expect-error TODO: fix this
  arrivalDate: datesAndMeals.arrivalDate,
  // @ts-expect-error TODO: fix this
  departureDate: datesAndMeals.departureDate,
  isSpecialDiet: datesAndMeals.isSpecialDiet === 'true',
  isArrivalLunch: datesAndMeals.isArrivalLunch,
  isArrivalDinner: datesAndMeals.isArrivalDinner,
  isDepartureLunch: datesAndMeals.isDepartureLunch,
  isDepartureDinner: datesAndMeals.isDepartureDinner,
  comment: datesAndMeals.comment,
  bedId,
  // @ts-expect-error TODO: fix this
  customer: {
    id: O.getOrUndefined(customer.id),
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: O.getOrUndefined(customer.phoneNumber),
    age: O.getOrUndefined(customer.age)
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
