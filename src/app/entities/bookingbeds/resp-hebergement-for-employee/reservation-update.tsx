import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, useToast } from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getSession } from 'app/shared/reducers/authentication'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

import {
  createMealsOnlyReservationReservationUpdateUser,
  reset as resetReservations
} from '../booking-beds.reducer'
import type {
  Customer,
  MealsOnlyReservationDatesAndMeals
} from '../models'
import { UserSummary } from '../resp-hebergement-for-habitant/user-summary'
import { createUserMealsOnlyReservation } from '../utils'
import { CustomerSummary } from './customer-summary'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices-user'
import { DatesAndMealsSummary } from './dates-and-meals-summary-user'
import { UserSelect } from './user-select'

export interface User {
  id: number
  firstname: O.Option<string>
  lastname: O.Option<string>
  email: string
  customerId: O.Option<number>
}

export type BedIds = ReadonlyArray<{ id: number }>

export const ReservationEmployeeUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<
    O.Option<MealsOnlyReservationDatesAndMeals>
  >(
    O.none()
  )
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none())
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [selectUser, setSelectUser] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)

  const [userId, setUserId] = useState<O.Option<number>>(O.none())

  const handleSubmitReservation = async (
    datesAndMeal: MealsOnlyReservationDatesAndMeals,
    customer: Customer,
    userId: number
  ): Promise<void> => {
    setIsLoading(true)
    const reservation = createUserMealsOnlyReservation(customer, datesAndMeal, O.none(), userId)

    await dispatch(
      createMealsOnlyReservationReservationUpdateUser(reservation)
    )

    dispatch(getSession())
    setIsLoading(false)
  }

  useEffect(() => {
    dispatch(resetReservations())
    setDatesAndMeal(O.none)
    setUpdateDatesAndMeals(false)
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      dispatch(resetReservations())

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
        Créer une réservation pour un salarié
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
          />
        ) :
        (
          <DatesAndMealsSummary
            datesAndMeals={datesAndMeal.value}
            setUpdate={setUpdateDatesAndMeals}
          />
        )}
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isSome(userId)
          && !updateDatesAndMeals && !updateCustomer ?
        (
          <HStack justifyContent={'end'}>
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
