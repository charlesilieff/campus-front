import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, useToast } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IBookingBeds } from 'app/shared/model/bookingBeds.model'
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  // getIntermittentReservations,
  getReservation
} from '../../reservation/reservation.reducer'
import {
  // createEntity,
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
// import { UserSummary } from './user-summary'

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
  firstname: O.Option<string>
  lastname: O.Option<string>
  email: string
  // phoneNumber: O.Option<string>
  // login: string
  customerId: O.Option<number>
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
  bedId: number
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
  const [selectUser, setSelectUser] = useState<boolean>(false)
  // const [isExistCustomer, setExistCustomer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)
  // const customerId = O.fromNullable(
  //   useAppSelector(state => state.authentication.account.customerId)
  // )

  const [userId, setUserId] = useState<number>(null)

  // const [user, setUser] = useState<O.Option<User>>(O.none)

  const handleSubmitReservation = async (
    datesAndMeal: DatesAndMeals,
    bedId: number,
    customer: Customer,
    userId: number
  ): Promise<void> => {
    setIsLoading(true)
    const reservation = createIReservationWithBedIds(customer, datesAndMeal, bedId)

    // const findReservationByThisUser = getIntermittentReservations(userId)
    // const findReservationByThisUser2 = dispatch(getIntermittentReservations(userId))

    // const reservationList = useAppSelector(state => state.reservation.entities)
    // useEffect(() => {
    //   dispatch(getIntermittentReservations(userId))
    // }, [])
    // console.log('reservationList', reservationList)

    // reservationList.forEach(reservation => {
    //   if (reservation.customer.id === customer.id) {
    //     toast({
    //       title: 'Une réservation existe déjà pour ce client',
    //       description: "Veuillez contacter l'administration",
    //       status: 'error',
    //       duration: 9000,
    //       isClosable: true
    //     })
    //   }
    // })

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

  // useEffect(() => {
  //   if (backendCustomer.id === undefined) {
  //     pipe(customerId, O.map(id => dispatch(getCustomer(id))))
  //   }

  //   if (backendCustomer.id !== undefined) {
  //     setCustomer(O.some({
  //       id: backendCustomer?.id,
  //       firstname: backendCustomer?.firstname,
  //       lastname: backendCustomer?.lastname,
  //       email: backendCustomer?.email,
  //       phoneNumber: O.some(backendCustomer?.phoneNumber),
  //       age: O.some(backendCustomer?.age)
  //     }))
  //   }
  // }, [backendCustomer.id])

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
  console.log('updateCustomer', updateCustomer)
  console.log('customer c', O.isNone(customer))
  console.log('userId ', userId)
  console.log('updateEmail ', selectUser)
  // const [selectedBeds, setSelectedBeds] = useState<readonly number[]>([])

  return (
    <Stack>
      <Heading size={'lg'} m={4}>
        Votre réservation
      </Heading>

      <UserSelect
        setUserId={setUserId}
        setCustomer={setCustomer}
        setUpdateUser={setSelectUser}
        // setUser={setUser}
        // user={user}
      />

      {
        /* {O.isNone(customer) && O.isNone(user) ? // {O.isNone(customer) || updateEmail  ?
        (<UserSelect
          setUserId={setUserId}
          setCustomer={setCustomer}
          setUpdateUser={setSelectUser}

          setUser={setUser}
          // user={user}
        />) :
        (
          // customer.value.email
          <UserSummary
            setUpdateUser={setSelectUser}
            user={O.getOrNull(user)}

          />
        )} */
      }

      {
        /* {(O.isNone(customer) || !customer.value.email || !customer.value.lastname
          || !customer.value.firstname)
          || updateCustomer ? */
      }
      {/* {(O.isNone(customer)) || userId ? */}
      {
        /* {(O.isNone(customer)) || userId ?
        (
          <CustomerUpdate
            customer={customer}
            setUpdateCustomer={setUpdateCustomer}
            setCustomer={setCustomer}
            // setUpdateUser={setSelectUser}

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
        )} */
      }

      {!userId ?
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
        (O.isNone(customer) || !customer.value.email || !customer.value.lastname
            || !customer.value.firstname)
          || updateCustomer ?
        (
          <CustomerUpdate
            customer={customer}
            setUpdateCustomer={setUpdateCustomer}
            setCustomer={setCustomer}
            // setUpdateUser={setSelectUser}

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

      {(O.isNone(customer) || !customer.value.lastname || !customer.value.firstname)
          || (updateCustomer && O.isNone(datesAndMeal)) ?
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
            // bedId={bedId}
            // selectedBeds={selectedBeds}
            // reservationId={O.fromNullable(reservationId)}
            // selectedBed={bedId => {
            //   !selectedBeds.includes(bedId) ?
            //     pipe(selectedBeds, A.append(bedId), d => setSelectedBeds(d)) :
            //     pipe(selectedBeds, A.filter(id => id !== bedId), setSelectedBeds)
            // }}
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
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isSome(bedId) && userId ?
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
                  userId
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
