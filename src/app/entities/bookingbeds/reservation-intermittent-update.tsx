import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { Heading } from '@chakra-ui/react'
import { pipe } from '@effect-ts/core'
import * as A from '@effect-ts/core/Collections/Immutable/Array'
import * as O from '@effect-ts/core/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { useDispatch } from 'react-redux'
import { getEntity } from './../customer/customer.reducer'
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
    dispatch(getEntity(1))
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
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)

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

  return (
    <div>
      <Heading size={'lg'} m={4}>
        Votre réservation
      </Heading>
      <CustomerSummary
        customer={customer}
        setUpdate={setUpdateCustomer}
      />
      {O.isNone(datesAndMeal) || updateDatesAndMeals ?
        (
          <DatesAndMealsChoices
            datesAndMeals={O.some(testValue)}
            setDatesAndMeal={setDatesAndMeal}
          />
        ) :
        (
          <DatesAndMealsSummary
            datesAndMeals={datesAndMeal.value}
            setUpdate={setUpdateDatesAndMeals}
          />
        )}
    </div>
  )
}

export default ReservationIntermittentUpdate
