import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, Text, useToast } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

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
import { DatesAndMealsChoices } from './dates-and-meals-choices-user'
import { DatesAndMealsSummary } from './dates-and-meals-summary-user'
import { UserSelect } from './user-select'
import { UserSummary } from './user-summary'

export interface User {
  id: number
  firstname: O.Option<string>
  lastname: O.Option<string>
  email: string
  customerId: O.Option<number>
}

export type BedIds = ReadonlyArray<{ id: number }>

export const ReservationHabitantUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<OneBedReservationDatesAndMeals>>(
    O.none()
  )
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none())
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [selectUser, setSelectUser] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)

  const [userId, setUserId] = useState<O.Option<number>>(O.none())

  const handleSubmitReservation = async (
    datesAndMeal: OneBedReservationDatesAndMeals,
    bedId: number,
    customer: Customer,
    userId: number
  ): Promise<void> => {
    setIsLoading(true)
    const reservation = createUserOneBedReservation(customer, datesAndMeal, O.some(bedId), userId)

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

  useEffect(() => {
    pipe(
      reservationId,
      O.fromNullable,
      O.map(id => dispatch(getReservation(id)))
    )

    if (backendReservation.arrivalDate !== undefined) {
      // @ts-expect-error TODO: fix this
      setDatesAndMeal(O.some({
        arrivalDate: backendReservation?.arrivalDate.toString(),
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

  return (
    <Stack>
      <Heading size={'lg'} m={4}>
        Créer une réservation pour un habitant
      </Heading>

      {O.isNone(userId) || O.isNone(customer) ?
        (
          <UserSelect
            setUserId={setUserId}
            setCustomer={setCustomer}
            setUpdateUser={setSelectUser}
            setUpdateCustomer={setUpdateCustomer}
          />
        ) :
        (
          <UserSummary
            email={customer.value.email}
            setUserId={setUserId}
            setUpdateUser={setSelectUser}
            setUpdateMeal={setUpdateDatesAndMeals}
            setUpdateCustomer={setUpdateCustomer}
          />
        )}

      {O.isNone(userId) || selectUser ?
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
            {'Informations personnelles'}
          </Heading>
        ) :
        (O.isNone(customer) || updateCustomer) ?
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

      {O.isNone(userId) || (O.isNone(customer) || updateCustomer) ?
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
        (O.isNone(datesAndMeal)) || (updateDatesAndMeals) ?
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

      {O.isSome(datesAndMeal) && !updateDatesAndMeals && userId ?
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
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isSome(bedId) && O.isSome(userId)
          && !updateDatesAndMeals && !updateCustomer ?
        (
          <HStack justifyContent={'end'}>
            <Text>{updateDatesAndMeals}</Text>
            <Button
              as={Link}
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
                handleSubmitReservation(
                  datesAndMeal.value,
                  bedId.value,
                  customer.value,
                  userId.value
                )}
            >
              Finaliser la réservation
            </Button>
          </HStack>
        ) :
        null}
    </Stack>
  )
}
