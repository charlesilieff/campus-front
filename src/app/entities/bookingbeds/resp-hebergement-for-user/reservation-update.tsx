import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, useToast } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer'
import type { IBookingBeds } from 'app/shared/model/bookingBeds.model'
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getCustomer } from '../../customer/customer.reducer'
import {
  getReservation
} from '../../reservation/reservation.reducer'
import {
  createEntity,
  createReservationAndUpdateUser,
  reset as resetReservations,
  updateEntity as updateReservation
} from '../booking-beds.reducer'
import { BedsChoices } from './bed-choices'
import { CustomerSummary } from './customer-summary'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices-intermittent'
import { DatesAndMealsSummary } from './dates-and-meals-summary-intermittent'
import { UserSelect } from './user-select'

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
}

export interface User {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: O.Option<string>
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
  bedId: number,
  user: User
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
  bedIds: [bedId],
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
  isDepartureBreakfast: datesAndMeals.isDepartureBreakfast
})

export const ReservationUserUpdate = (): JSX.Element => {
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

  const [user, setUser] = useState<O.Option<User>>(O.none)
  const userId: number = useAppSelector(state => state.authentication.account.id)
  // const userId: number = useAppSelector(state => state.authentication.account.id)
  // const userId: number = useAppSelector(state => state.administration.userManagement.user.id)

  const handleSubmitReservation = async (
    datesAndMeal: DatesAndMeals,
    bedId: number,
    customer: Customer,
    user: User
  ): Promise<void> => {
    const reservation = createIReservationWithBedIds(customer, datesAndMeal, bedId, user)

    setIsLoading(true)
    if (reservationId !== undefined) {
      // FIXME: unsafe
      await dispatch(updateReservation({ ...reservation, id: Number(reservationId) }))
      setIsLoading(false)
    } else {
      if (O.isSome(customerId)) {
        await dispatch(createEntity({ entity: reservation, sendMail: false }))
        setIsLoading(false)
      } else {
        await dispatch(
          createReservationAndUpdateUser({ entity: reservation, sendMail: false, userId })
        )

        dispatch(getSession())
        setIsLoading(false)
      }
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
        isDepartureBreakfast: backendReservation.isDepartureBreakfast
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

  return (
    <Stack>
      <Heading size={'lg'} m={4}>
        Votre réservation
      </Heading>

      {O.isNone(user) ?
        (
          <UserSelect
            // email={ user.email}
            // firstname={ user.firstname}
            // lastname={ user.lastname}
          />
        ) :
        (
          <UserSelect
            // email={ user.email.getOrElse('')}
            // firstname={ user.firstname}
            // lastname={ user.lastname}
          />
        )}
      {O.isNone(customer) || updateCustomer ?
        (
          <CustomerUpdate
            customer={customer}
            setUpdateCustomer={setUpdateCustomer}
            setCustomer={setCustomer}
            // customer={customer}
            // setUpdateCustomer={setUpdateCustomer}
            // setCustomer={setCustomer}
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
          />
        ) :
        (
          <DatesAndMealsSummary
            datesAndMeals={datesAndMeal.value}
            setUpdate={setUpdateDatesAndMeals}
            setBedId={setBedId}
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
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isSome(bedId) ?
        (
          <HStack justifyContent={'end'}>
            <Button as={Link} to={''} colorScheme={'red'} rightIcon={<BsTrash />}>Annuler</Button>
            <Button
              isLoading={isLoading}
              colorScheme={'blue'}
              rightIcon={<CheckIcon />}
              onClick={() =>
                handleSubmitReservation(
                  datesAndMeal.value,
                  bedId.value,
                  customer.value,
                  user.value
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
