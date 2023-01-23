import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, useToast } from '@chakra-ui/react'
import { pipe } from '@effect-ts/core'
import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as O from '@effect-ts/core/Option'
import { BsTrash } from '@react-icons/all-files/bs/BsTrash'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { ICustomer } from 'app/shared/model/customer.model'
import { IReservation } from 'app/shared/model/reservation.model'
import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import { getEntity as getCustomerEntity } from '../../customer/customer.reducer'
import { createEntity } from '../booking-beds.reducer'
import { CustomerSummary } from '../customer-summary'
import { BedsChoices } from './bed-choices'
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
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
  age: O.Option<number>
}

export type BedIds = A.Array<{ id: number }>

export const ReservationIntermittentUpdate = (
  props: RouteComponentProps<{ id: string }>
): JSX.Element => {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)
  const createIReservation = (
    customer: Customer,
    datesAndMeals: O.Option<DatesAndMeals>,
    bedId: O.Option<number>
  ): O.Option<IReservation> => {
    if (O.isNone(datesAndMeals) || O.isNone(bedId)) {
      return O.none
    } else {
      const Icustomer: ICustomer = {
        firstname: customer.firstname,
        lastname: customer.lastname,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        age: O.toUndefined(customer.age),
        isFemal: false
      }

      const reservation: IReservation = {
        // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
        arrivalDate: datesAndMeals.value.arrivalDate,
        // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
        departureDate: datesAndMeals.value.departureDate,
        specialDietNumber: datesAndMeals.value.specialDiet === 'true' ? 1 : 0,
        isArrivalLunch: datesAndMeals.value.isArrivalLunch,
        isArrivalDiner: datesAndMeals.value.isArrivalDinner,
        isDepartureLunch: datesAndMeals.value.isDepartureLunch,
        isDepartureDiner: datesAndMeals.value.isDepartureDinner,
        comment: datesAndMeals.value.comment,
        beds: [{ id: bedId.value }],
        isConfirmed: true,
        isPaid: false,
        isLunchOnly: false,
        paymentMode: '',
        personNumber: 1,
        customer: Icustomer
      }

      return O.some(reservation)
    }
  }

  const handleSubmitReservation = (): void => {
    const reservation = createIReservation(customer, datesAndMeal, bedId)
    if (O.isSome(reservation)) {
      dispatch(createEntity(reservation.value))
    } else {
      alert('Veuillez remplir tous les champs')
    }
  }

  useEffect(() => {
    dispatch(getCustomerEntity(props.match.params.id))
  }, [])
  const customer: Customer = pipe(
    useAppSelector(state => state.customer.entity),
    c => ({
      firstname: c?.firstname,
      lastname: c?.lastname,
      email: c?.email,
      phoneNumber: c?.phoneNumber,
      age: O.some(c?.age)
    })
  )
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<DatesAndMeals>>(O.none)
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)

  const [bedId, setBedId] = useState<O.Option<number>>(O.none)

  useEffect(() => {
    if (updateSuccess) {
      toast({
        position: 'top',
        title: 'Réservation crée !',
        description: 'A bientôt !',
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      props.history.push('/planning')
    }
  }, [updateSuccess])
  const testValue = {
    arrivalDate: '2021-22-02',
    departureDate: '2021-22-03',
    specialDiet: 'false' as const,
    isArrivalLunch: true,
    isArrivalDinner: false,
    isDepartureLunch: true,
    isDepartureDinner: false,
    comment: 'test'
  }

  return (
    <Stack>
      <Heading size={'lg'} m={4}>
        Votre réservation
      </Heading>
      <CustomerSummary
        customer={customer}
      />
      {O.isNone(datesAndMeal) || updateDatesAndMeals ?
        (
          <DatesAndMealsChoices
            datesAndMeals={O.some(testValue)}
            setUpdateDatesAndMeals={setUpdateDatesAndMeals}
            setDatesAndMeal={setDatesAndMeal}
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
      {(O.isSome(datesAndMeal) || updateDatesAndMeals) && O.isSome(bedId) ?
        (
          <HStack justifyContent={'end'}>
            <Button as={Link} to={''} colorScheme={'red'} rightIcon={<BsTrash />}>Annuler</Button>
            <Button
              colorScheme={'blue'}
              rightIcon={<CheckIcon />}
              onClick={() => handleSubmitReservation()}
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
