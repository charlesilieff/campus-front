import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, useToast } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getUserCategories } from 'app/entities/user-category/user-category.reducer'
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getCustomer } from '../../customer/customer.reducer'
import {
  getReservation
} from '../../reservation/reservation.reducer'
import {
  createOneBedUserReservationUpdateUser,
  reset as resetReservations,
  updateOneBedUserReservationReservation
} from '../booking-beds.reducer'
import type { Customer, OneBedReservationDatesAndMeals } from '../models'
import { createUserOneBedReservation } from '../utils'
import { BedsChoices } from './bed-choices'
import { CustomerSummary } from './customer-summary'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices-intermittent'
import { DatesAndMealsSummary } from './dates-and-meals-summary-intermittent'

export const ReservationIntermittentUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<OneBedReservationDatesAndMeals>>(O.none)
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
  // @ts-expect-error TODO: fix this
  const userId: number = useAppSelector(state => state.authentication.account.id)

  const handleSubmitReservation = async (
    datesAndMeal: OneBedReservationDatesAndMeals,
    bedId: O.Option<number>,
    customer: Customer,
    userId: number
  ): Promise<void> => {
    const reservation = createUserOneBedReservation(customer, datesAndMeal, bedId, userId)

    setIsLoading(true)
    if (reservationId !== undefined) {
      // FIXME: unsafe
      await dispatch(
        updateOneBedUserReservationReservation({
          ...reservation,
          id: O.some(Number(reservationId))
        })
      )
      setIsLoading(false)
    } else {
      await dispatch(
        createOneBedUserReservationUpdateUser(reservation)
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
      // @ts-expect-error TODO: fix this
      setCustomer(O.some({
        id: O.fromNullable(backendCustomer?.id),
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
      // @ts-expect-error TODO: fix this
      setDatesAndMeal(O.some({
        arrivalDate: backendReservation.arrivalDate.toString(),
        // @ts-expect-error TODO: fix this
        departureDate: backendReservation.departureDate.toString(),
        isSpecialDiet: backendReservation.specialDietNumber === 1 ? 'true' : 'false',
        isArrivalLunch: backendReservation.isArrivalLunch,
        isArrivalDinner: backendReservation.isArrivalDiner,
        isDepartureLunch: backendReservation.isDepartureLunch,
        isDepartureDinner: backendReservation.isDepartureDiner,
        comment: backendReservation.comment,
        isArrivalBreakfast: backendReservation.isArrivalBreakfast,
        isDepartureBreakfast: backendReservation.isDepartureBreakfast,
        commentMeals: backendReservation.commentMeals
      }))
      // @ts-expect-error TODO: fix this
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
            {'Choix du lit'}
          </Heading>
        )}
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isNone(bedId) && !updateDatesAndMeals
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
              onClick={() =>
                handleSubmitReservation(datesAndMeal.value, O.none(), customer.value, userId)}
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
              onClick={() =>
                handleSubmitReservation(datesAndMeal.value, bedId, customer.value, userId)}
            >
              Finaliser la réservation
            </Button>
          </HStack>
        ) :
        null}
    </Stack>
  )
}
