import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, useToast } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { IReservation } from 'app/shared/model/reservation.model'
import { Option as O, pipe } from 'effect'
import React, { useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getEntity as getReservationEntity } from '../../reservation/reservation.reducer'
import { createIntermittentReservation, reset } from '../booking-beds.reducer'
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
}

export interface Customer {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
  age: O.Option<number>
}

export type BedIds = ReadonlyArray<{ id: number }>

const createIReservation = (
  customer: Customer,
  datesAndMeals: DatesAndMeals,
  bedId: number
): IReservation => ({
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
  beds: [{ id: bedId }],
  isConfirmed: true,
  isPaid: false,
  isLunchOnly: false,
  paymentMode: '',
  personNumber: 1,
  customer: {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    age: O.getOrUndefined(customer.age)
  }
})

export const ReservationIntermittentUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<DatesAndMeals>>(O.none)
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none)
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { reservationId } = useParams<{ reservationId: string }>()
  // const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)

  const handleSubmitReservation = (
    datesAndMeal: DatesAndMeals,
    bedId: number,
    customer: Customer
  ): void => {
    const reservation = createIReservation(customer, datesAndMeal, bedId)

    setIsLoading(true)
    dispatch(createIntermittentReservation(reservation)).then(() => setIsLoading(false))
  }

  const backendReservation = useAppSelector(state => state.reservation.entity)

  useEffect(() => {
    pipe(
      reservationId,
      O.fromNullable,
      O.map(id => dispatch(getReservationEntity(id)))
    )

    if (backendReservation.customer !== undefined) {
      setCustomer(O.some({
        id: backendReservation.customer?.id,
        firstname: backendReservation.customer?.firstname,
        lastname: backendReservation.customer?.lastname,
        email: backendReservation.customer?.email,
        phoneNumber: backendReservation.customer?.phoneNumber,
        age: O.some(backendReservation.customer?.age)
      }))
    }
    if (backendReservation.arrivalDate !== undefined) {
      setDatesAndMeal(O.some({
        arrivalDate: backendReservation?.arrivalDate.toString(),
        departureDate: backendReservation.departureDate.toString(),
        specialDiet: backendReservation.specialDietNumber === 1 ? 'true' : 'false',
        isArrivalLunch: backendReservation.isArrivalLunch,
        isArrivalDinner: backendReservation.isArrivalDiner,
        isDepartureLunch: backendReservation.isDepartureLunch,
        isDepartureDinner: backendReservation.isDepartureDiner,
        comment: backendReservation.comment
      }))
    }
  }, [backendReservation.id])

  const [bedId, setBedId] = useState<O.Option<number>>(O.none)

  useEffect(() => {
    if (updateSuccess) {
      dispatch(reset())
      toast({
        position: 'top',
        title: 'Réservation crée !',
        description: 'A bientôt !',
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      navigate('/planning')
    }
  }, [updateSuccess])

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
                handleSubmitReservation(datesAndMeal.value, bedId.value, customer.value)}
            >
              Finaliser la réservation
            </Button>
          </HStack>
        ) :
        null}
    </Stack>
  )
}

export default ReservationIntermittentUpdate
