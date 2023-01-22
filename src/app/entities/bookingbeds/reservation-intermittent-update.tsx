import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack } from '@chakra-ui/react'
import { pipe } from '@effect-ts/core'
import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as O from '@effect-ts/core/Option'
import { BsTrash } from '@react-icons/all-files/bs/BsTrash'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { getEntity as getCustomerEntity } from './../customer/customer.reducer'
import { BedsChoices } from './bed-choices'
import { CustomerSummary } from './customer-summary'
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

export const ReservationIntermittentUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getCustomerEntity(1))
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

  const testValue = {
    arrivalDate: '22/02/2021',
    departureDate: '22/02/2021',
    specialDiet: 'false' as const,
    isArrivalLunch: true,
    isArrivalDinner: false,
    isDepartureLunch: true,
    isDepartureDinner: false,
    comment: 'test'
  }
  console.log(datesAndMeal)
  console.log('updateDatesAndMeals', updateDatesAndMeals)
  console.log(bedId)
  console.log((O.isSome(datesAndMeal) || updateDatesAndMeals) && O.isSome(bedId))
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
            datesAndMeals={datesAndMeal}
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
            <Button colorScheme={'red'} rightIcon={<BsTrash />}>Annuler</Button>
            <Button colorScheme={'blue'} rightIcon={<CheckIcon />}>Finaliser la réservation</Button>
          </HStack>
        ) :
        null}
    </Stack>
  )
}

export default ReservationIntermittentUpdate
