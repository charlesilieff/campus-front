import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, useToast } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getUserCategories } from 'app/entities/user-category/user-category.reducer'
import type { IBookingBeds } from 'app/shared/model/bookingBeds.model'
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getCustomer } from '../../customer/customer.reducer'
import {
  getReservation
} from '../../reservation/reservation.reducer'
import {
  createReservationAndUpdateUser,
  createReservationWithoutMealsAndUpdateUser,
  reset as resetReservations,
  updateEntity as updateReservation
} from '../booking-beds.reducer'
import { BedsChoices } from './bed-choices'
import { CustomerSummary } from './customer-summary'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices-invite'
import { DatesAndMealsSummary } from './dates-and-meals-summary-invite'

export interface DatesAndMeals {
  arrivalDate: string
  departureDate: string
  // specialDiet: 'false' | 'true'
  isArrivalLunch: boolean
  isArrivalDinner: boolean
  isDepartureLunch: boolean
  isDepartureDinner: boolean
  comment: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  personNumber: number
  specialDietNumber: number
  commentMeals: string
  withBeds: boolean
}

export interface Reservation {
  id: O.Option<number>
  reservationNumber: string
  personNumber: number
  arrivalDate: string
  departureDate: string
  specialDietNumber: number
  isArrivalLunch: boolean
  isArrivalDinner: boolean
  isDepartureLunch: boolean
  isDepartureDinner: boolean
  comment: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: string
}

export interface Customer {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: O.Option<string>
  age: O.Option<number>
}

export type BedIds = ReadonlyArray<{ id: number }>

// useEffect(() => {
//   dispatch(getEntity(1))
// }, [])
// const user_categories = getEntities()
// const user_category = getEntity(1)

// const userCategories = useAppSelector(state => state.userCategory.entities)
// const userCategory = userCategories.find(userCategory => userCategory.name === 'Intermittent')

// const entity = userCategories.findIndex(userCategory => userCategory.id === 1)

const createIReservationWithBedIds = (
  customer: Customer,
  datesAndMeals: DatesAndMeals,
  bedId: number
): IBookingBeds => ({
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  arrivalDate: datesAndMeals.arrivalDate,
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  departureDate: datesAndMeals.departureDate,
  specialDietNumber: datesAndMeals.specialDietNumber, // === 'true' ? 1 : 0,
  isArrivalLunch: datesAndMeals.isArrivalLunch,
  isArrivalDiner: datesAndMeals.isArrivalDinner,
  isDepartureLunch: datesAndMeals.isDepartureLunch,
  isDepartureDiner: datesAndMeals.isDepartureDinner,
  comment: datesAndMeals.comment,
  bedIds: [bedId],
  isConfirmed: true,
  isPaid: false,
  paymentMode: '',
  personNumber: datesAndMeals.personNumber,
  customer: {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: O.getOrUndefined(customer.phoneNumber),
    age: O.getOrUndefined(customer.age)
  },
  isArrivalBreakfast: datesAndMeals.isArrivalBreakfast,
  isDepartureBreakfast: datesAndMeals.isDepartureBreakfast,
  userCategoryId: 1,
  // userCategory: {
  //   id: userCategory.id,
  //   name: userCategory.name,
  //   comment: userCategory.comment
  // }
  commentMeals: datesAndMeals.commentMeals
})
const createIReservationWithoutBedIds = (
  customer: Customer,
  datesAndMeals: DatesAndMeals
  // bedId: number
): IBookingBeds => ({
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  arrivalDate: datesAndMeals.arrivalDate,
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  departureDate: datesAndMeals.departureDate,
  specialDietNumber: datesAndMeals.specialDietNumber, // === 'true' ? 1 : 0,
  isArrivalLunch: datesAndMeals.isArrivalLunch,
  isArrivalDiner: datesAndMeals.isArrivalDinner,
  isDepartureLunch: datesAndMeals.isDepartureLunch,
  isDepartureDiner: datesAndMeals.isDepartureDinner,
  comment: datesAndMeals.comment,
  // bedIds: [bedId],
  isConfirmed: true,
  isPaid: false,
  paymentMode: '',
  personNumber: datesAndMeals.personNumber,
  customer: {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: O.getOrUndefined(customer.phoneNumber),
    age: O.getOrUndefined(customer.age)
  },
  isArrivalBreakfast: datesAndMeals.isArrivalBreakfast,
  isDepartureBreakfast: datesAndMeals.isDepartureBreakfast,
  userCategoryId: 1,
  // userCategory: {
  //   id: userCategory.id,
  //   name: userCategory.name,
  //   comment: userCategory.comment
  // }
  commentMeals: datesAndMeals.commentMeals
})

export const ReservationInviteUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<DatesAndMeals>>(O.none)
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none)
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateBeds, setUpdateBeds] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)
  const customerId = O.fromNullable(
    useAppSelector(state => state.authentication.account.customerId)
  )
  // const getEntity = useAppSelector(state => state.user-category.)

  const userId: number = useAppSelector(state => state.authentication.account.id)

  const handleSubmitReservation = async (
    datesAndMeal: DatesAndMeals,
    bedId: number,
    customer: Customer
  ): Promise<void> => {
    const reservation = createIReservationWithBedIds(customer, datesAndMeal, bedId)
    // console.log('reservation', reservation)

    setIsLoading(true)
    if (reservationId !== undefined) {
      // FIXME: unsafe
      await dispatch(updateReservation({ ...reservation, id: Number(reservationId) }))
      setIsLoading(false)
    } else {
      console.log('test reservation', reservation)
      await dispatch(
        createReservationAndUpdateUser({ entity: reservation, sendMail: false, userId })
      )

      dispatch(getSession())
      setIsLoading(false)
    }
  }
  const handleSubmitReservationWithoutBed = async (
    datesAndMeal: DatesAndMeals,
    // bedId: number,
    customer: Customer
  ): Promise<void> => {
    const reservation = createIReservationWithoutBedIds(customer, datesAndMeal)
    console.log('reservation', reservation)

    setIsLoading(true)
    if (reservationId !== undefined) {
      // FIXME: unsafe
      await dispatch(updateReservation({ ...reservation, id: Number(reservationId) }))
      setIsLoading(false)
    } else {
      await dispatch(
        createReservationWithoutMealsAndUpdateUser({ entity: reservation, sendMail: false, userId })
      )

      dispatch(getSession())
      setIsLoading(false)
    }

    // await dispatch(
    //   createReservationWithoutMealsAndUpdateUser({ entity: reservation, sendMail: false, userId })
    // )

    // dispatch(getSession())
    // setIsLoading(false)
  }

  // const handleSubmitReservationWithoutBed = async (
  //   datesAndMeal: DatesAndMeals,
  //   customer: Customer
  // ): Promise<void> => {
  //   // if (customer !== undefined) {
  //   //   // FIXME: unsafe
  //   //   // await dispatch(updateReservation({ ...reservation, id: Number(result) }))
  //   //   // setIsLoading(false)
  //   // } else {

  //   // }

  //   const reservation = createIReservationWithoutBedIds(customer, datesAndMeal)

  //   setIsLoading(true)

  //   const requestUrl = `/api/bookingbeds/meals/${userId}`
  //   const result = await axios.post<IBookingBeds>(
  //     requestUrl,
  //     // cleanEntity(reservation),
  //     reservation,
  //     {
  //       params: { sendMail: false }
  //     }
  //   )
  //   dispatch(getSession())
  //   setIsLoading(false)

  //   result

  //   //   return result
  //   // }

  //   // if (reservationId !== undefined) {
  //   //   // FIXME: unsafe
  //   //   await dispatch(updateReservation({ ...reservation, id: Number(reservationId) }))
  //   //   setIsLoading(false)
  //   // } else {
  //   //   console.log('test reservation', reservation)
  //   //   await dispatch(
  //   //     // createEntity({ entity: reservation, sendMail: false, userId })
  //   //     createReservationAndUpdateUser({ entity: reservation, sendMail: false, userId })
  //   //   )

  //   //   dispatch(getSession())
  //   //   setIsLoading(false)
  //   // }
  // }

  // const handleSubmitReservation2 = async (
  //   reservation: Reservation,
  //   customer: Customer
  // ): Promise<void> => {
  //   const reservationRequest = createReservationRequest(customer, reservation, uuid)

  //   setIsLoading(true)
  //   // if (uuid !== undefined) {
  //   //   await dispatch(updateEntity(reservationRequest))
  //   //   setIsLoading(false)
  //   //   setUpdateSuccess(true)
  //   // } else {
  //   //   const { payload } = await dispatch(createEntity(reservationRequest.ReservationRequest))
  //   //   setIsLoading(false)
  //   //   setUpdateSuccess(true)
  //   //   // @ts-expect-error dddd
  //   //   setUUID(payload.data.reservation.reservationNumber)
  //   // }
  // }

  const backendReservation = useAppSelector(state => state.reservation.entity)
  const backendCustomer = useAppSelector(state => state.customer.entity)

  useEffect(() => {
    if (backendCustomer.id === undefined) {
      pipe(customerId, O.map(id => dispatch(getCustomer(id))))
    }

    if (backendCustomer.id !== undefined) {
      setCustomer(O.some({
        id: backendCustomer?.id,
        firstname: backendCustomer?.firstname,
        lastname: backendCustomer?.lastname,
        email: backendCustomer?.email,
        phoneNumber: O.some(backendCustomer?.phoneNumber),
        age: O.some(backendCustomer?.age)
      }))
    }
  }, [backendCustomer.id])

  useEffect(() => {
    pipe(
      reservationId,
      O.fromNullable,
      O.map(id => dispatch(getReservation(id)))
    )

    if (backendReservation.arrivalDate !== undefined) {
      setDatesAndMeal(O.some({
        arrivalDate: backendReservation?.arrivalDate.toString(),
        departureDate: backendReservation.departureDate.toString(),
        specialDietNumber: backendReservation.specialDietNumber, // === 1 ? 'true' : 'false',
        isArrivalLunch: backendReservation.isArrivalLunch,
        isArrivalDinner: backendReservation.isArrivalDiner,
        isDepartureLunch: backendReservation.isDepartureLunch,
        isDepartureDinner: backendReservation.isDepartureDiner,
        comment: backendReservation.comment,
        isArrivalBreakfast: backendReservation.isArrivalBreakfast,
        isDepartureBreakfast: backendReservation.isDepartureBreakfast,
        personNumber: backendReservation.personNumber,
        commentMeals: backendReservation.commentMeals,
        // withBeds: backendReservation.withBeds
        withBeds: false
      }))
      setBedId(pipe(backendReservation.beds, A.head, O.map(bed => bed.id)))
    }
  }, [backendReservation.id])
  useEffect(() => {
    if (reservationId === undefined) {
      dispatch(resetReservations())
      setDatesAndMeal(O.none)
      setUpdateDatesAndMeals(false)
      setUpdateBeds(false)
    }
  }, [])
  const [bedId, setBedId] = useState<O.Option<number>>(O.none)

  useEffect(() => {
    if (updateSuccess) {
      dispatch(resetReservations())
      if (reservationId !== undefined) {
        toast({
          position: 'top',
          title: 'Réservation modifiée !',
          description: 'A bientôt !',
          status: 'success',
          duration: 9000,
          isClosable: true
        })
      } else {
        toast({
          position: 'top',
          title: 'Réservation crée !',
          description: 'A bientôt !',
          status: 'success',
          duration: 9000,
          isClosable: true
        })
      }
      navigate('/planning')
    }
  }, [updateSuccess])

  useEffect(() => {
    dispatch(getUserCategories())
  }, [])

  return (
    <Stack>
      <Heading size={'lg'} m={4}>
        Votre réservation
      </Heading>
      {O.isNone(customer) || updateCustomer ?
        (
          <CustomerUpdate
            customer={customer}
            setUpdateCustomer={setUpdateCustomer}
            setCustomer={setCustomer}
          />
        ) :
        (
          <CustomerSummary
            setUpdateCustomer={setUpdateCustomer}
            customer={customer.value}
          />
        )}
      {O.isNone(customer) || (updateCustomer && O.isNone(datesAndMeal)) ?
        (
          <Heading
            p={4}
            borderRadius={8}
            borderColor={'#D9D9D9'}
            border={'solid'}
            fontWeight={'bold'}
            fontSize={'25'}
            color={'#C4C4C4'}
          >
            {'Date et repas'}
          </Heading>
        ) :
        O.isNone(datesAndMeal) || updateDatesAndMeals ?
        (
          <DatesAndMealsChoices
            datesAndMeals={datesAndMeal}
            setUpdateDatesAndMeals={setUpdateDatesAndMeals}
            setDatesAndMeal={setDatesAndMeal}
            setUpdateBeds={setUpdateBeds}
          />
        ) :
        (
          <DatesAndMealsSummary
            datesAndMeals={datesAndMeal.value}
            setUpdate={setUpdateDatesAndMeals}
            setBedId={setBedId}
            updateBeds={updateBeds}
          />
        )}
      {O.isSome(datesAndMeal) && !updateDatesAndMeals && updateBeds ?
        (
          <BedsChoices
            datesAndMeals={datesAndMeal}
            bedId={bedId}
            setSelectedBedId={setBedId}
            reservationId={O.fromNullable(reservationId)}
          />
        ) :
        (
          <Heading
            p={4}
            borderRadius={8}
            borderColor={'#D9D9D9'}
            border={'solid'}
            fontWeight={'bold'}
            fontSize={'25'}
            color={'#C4C4C4'}
          >
            {'Choix des lits'}
          </Heading>
        )}
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isSome(bedId) ?
        (
          <HStack justifyContent={'end'}>
            <Button
              as={Link}
              to={''}
              colorScheme={'red'}
              leftIcon={<FaArrowLeft />}
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
            <Button
              isLoading={isLoading}
              colorScheme={'blue'}
              rightIcon={<CheckIcon />}
              onClick={() =>
                handleSubmitReservation(datesAndMeal.value, bedId.value, customer.value)}
            >
              Finaliser la réservation
            </Button>
          </HStack>
        ) :
        null}
      {O.isSome(customer) && O.isSome(datesAndMeal) && !updateBeds && !updateDatesAndMeals
          && !updateCustomer ?
        (
          <Stack justifyContent={'end'} direction={['column', 'row']}>
            <Button
              as={Link}
              to={''}
              colorScheme={'red'}
              leftIcon={<FaArrowLeft />}
              onClick={() => navigate(-1)}
            >
              Retour
            </Button>
            <Button
              isLoading={isLoading}
              colorScheme={'blue'}
              rightIcon={<CheckIcon />}
              onClick={() => handleSubmitReservationWithoutBed(datesAndMeal.value, customer.value)}
            >
              Finaliser la réservation
            </Button>
          </Stack>
        ) :
        null}
    </Stack>
  )
}
