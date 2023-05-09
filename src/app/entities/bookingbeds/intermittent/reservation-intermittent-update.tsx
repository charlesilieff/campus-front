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
  reset as resetReservations,
  updateEntity as updateReservation
} from '../booking-beds.reducer'
import { BedsChoices } from './bed-choices'
import { CustomerSummary } from './customer-summary'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices-intermittent'
import { DatesAndMealsSummary } from './dates-and-meals-summary-intermittent'

export interface DatesAndMeals {
  arrivalDate: string
  departureDate: string
  specialDiet: 'false' | 'true'
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

const createIReservationWithBedIds = (
  customer: Customer,
  datesAndMeals: DatesAndMeals,
  bedId: O.Option<number>
): IBookingBeds => ({
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  arrivalDate: datesAndMeals.arrivalDate,
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  departureDate: datesAndMeals.departureDate,
  specialDietNumber: datesAndMeals.specialDiet === 'true' ? 1 : 0,
  isArrivalLunch: datesAndMeals.isArrivalLunch,
  isArrivalDiner: datesAndMeals.isArrivalDinner,
  isDepartureLunch: datesAndMeals.isDepartureLunch,
  isDepartureDiner: datesAndMeals.isDepartureDinner,
  comment: datesAndMeals.comment,
  bedIds: O.isSome(bedId) ? [bedId.value] : [],
  isConfirmed: true,
  isPaid: false,
  paymentMode: '',
  personNumber: 1,
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
  commentMeals: datesAndMeals.commentMeals
  // userCategoryId: 2
})

export const ReservationIntermittentUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<DatesAndMeals>>(O.none)
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none)
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
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

  const userId: number = useAppSelector(state => state.authentication.account.id)

  const handleSubmitReservation = async (
    datesAndMeal: DatesAndMeals,
    bedId: O.Option<number>,
    customer: Customer
  ): Promise<void> => {
    const reservation = createIReservationWithBedIds(customer, datesAndMeal, bedId)

    setIsLoading(true)
    if (reservationId !== undefined) {
      // FIXME: unsafe
      await dispatch(updateReservation({ ...reservation, id: Number(reservationId) }))
      setIsLoading(false)
    } else {
      await dispatch(
        createReservationAndUpdateUser({ entity: reservation, sendMail: false, userId })
      )

      dispatch(getSession())
      setIsLoading(false)
    }
  }

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
        specialDiet: backendReservation.specialDietNumber === 1 ? 'true' : 'false',
        isArrivalLunch: backendReservation.isArrivalLunch,
        isArrivalDinner: backendReservation.isArrivalDiner,
        isDepartureLunch: backendReservation.isDepartureLunch,
        isDepartureDinner: backendReservation.isDepartureDiner,
        comment: backendReservation.comment,
        isArrivalBreakfast: backendReservation.isArrivalBreakfast,
        isDepartureBreakfast: backendReservation.isDepartureBreakfast,
        commentMeals: backendReservation.commentMeals
        // userCategoryId: backendReservation.userCategory
      }))
      setBedId(pipe(backendReservation.beds, A.head, O.map(bed => bed.id)))
    }
  }, [backendReservation.id])
  useEffect(() => {
    if (reservationId === undefined) {
      dispatch(resetReservations())
      setDatesAndMeal(O.none)
      setUpdateDatesAndMeals(false)
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
            setBedId={setBedId}
          />
        ) :
        (
          <DatesAndMealsSummary
            datesAndMeals={datesAndMeal.value}
            setUpdate={setUpdateDatesAndMeals}
          />
        )}
      {O.isSome(datesAndMeal) && !updateDatesAndMeals ?
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
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isNone(bedId) ?
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
              onClick={() => handleSubmitReservation(datesAndMeal.value, O.none(), customer.value)}
            >
              Finaliser la réservation sans lit
            </Button>
          </HStack>
        ) :
        null}
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isSome(bedId) && !updateDatesAndMeals
          && !updateCustomer ?
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
              onClick={() => handleSubmitReservation(datesAndMeal.value, bedId, customer.value)}
            >
              Finaliser la réservation
            </Button>
          </HStack>
        ) :
        null}
    </Stack>
  )
}
