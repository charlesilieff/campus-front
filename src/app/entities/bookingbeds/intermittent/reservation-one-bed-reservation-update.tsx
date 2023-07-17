import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, useToast } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getUserCategories } from 'app/entities/user-category/user-category.reducer'
import type { Customer } from 'app/shared/model/customer.model'
import { getSession } from 'app/shared/reducers/authentication'
import dayjs from 'dayjs'
import { Option as O } from 'effect'
import { ReadonlyArray as A } from 'effect'
import { pipe } from 'effect'
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
import type {
  OneBedReservationDatesAndMeals
} from '../models/OneBedReservationDatesAndMeals'
import { createUserOneBedReservation, isArrivalDateEqualDepartureDate } from '../utils'
import { BedsChoices } from './bed-choices'
import { CustomerSummary } from './customer-summary'
import type { CustomerForm } from './customer-update'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices-intermittent'
import { DatesAndMealsSummary } from './dates-and-meals-summary-intermittent'

export const OneBedReservationUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<OneBedReservationDatesAndMeals>>(
    O.none()
  )
  const [customer, setCustomer] = useState<O.Option<CustomerForm>>(O.none())
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)
  const account = useAppSelector(state => state.authentication.account)

  const customerId = pipe(
    account,
    O.flatMap(c => c.customerId)
  )

  const userId = pipe(
    account,
    O.flatMap(account => account.id)
  )

  const handleSubmitReservation = async (
    datesAndMeal: OneBedReservationDatesAndMeals,
    bedId: O.Option<number>,
    customer: Customer,
    userId: number
  ): Promise<void> => {
    const reservation = createUserOneBedReservation(
      customer,
      {
        ...datesAndMeal,
        departureDate:
          isArrivalDateEqualDepartureDate(datesAndMeal.arrivalDate, datesAndMeal.departureDate) ?
            dayjs(datesAndMeal.arrivalDate).add(1, 'day').toDate() :
            datesAndMeal.departureDate
      },
      bedId,
      userId
    )

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
    if (O.isSome(customerId)) {
      pipe(customerId, O.map(id => dispatch(getCustomer(id))))
    }
  }, [])

  useEffect(() => {
    if (O.isSome(backendCustomer)) {
      setCustomer(O.some({
        id: backendCustomer.value.id,
        firstname: O.some(backendCustomer.value.firstname),
        lastname: O.some(backendCustomer.value.lastname),
        email: backendCustomer.value.email,
        phoneNumber: backendCustomer.value.phoneNumber,
        age: backendCustomer.value.age,
        comment: backendCustomer.value.comment
      }))
    } else if (O.isSome(account)) {
      setCustomer(O.some({
        id: O.none(),
        firstname: account.value.firstName !== undefined ? account.value.firstName : O.none(),
        lastname: account.value.lastName !== undefined ? account.value.lastName : O.none(),
        email: account.value.email,
        phoneNumber: O.none(),
        age: O.none(),
        comment: O.none()
      }))
    }
  }, [pipe(backendCustomer, O.flatMap(c => c.id))])

  useEffect(() => {
    pipe(
      reservationId,
      O.fromNullable,
      O.map(id => dispatch(getReservation(id)))
    )

    if (O.isSome(backendReservation)) {
      setDatesAndMeal(O.some({
        arrivalDate: backendReservation.value.arrivalDate,

        departureDate: backendReservation.value.departureDate,
        isSpecialDiet: backendReservation.value.specialDietNumber === 1 ? 'true' : 'false',
        isArrivalLunch: backendReservation.value.isArrivalLunch,
        isArrivalDinner: backendReservation.value.isArrivalDinner,
        isDepartureLunch: backendReservation.value.isDepartureLunch,
        isDepartureDinner: backendReservation.value.isDepartureDinner,
        comment: backendReservation.value.comment,
        isArrivalBreakfast: backendReservation.value.isArrivalBreakfast,
        isDepartureBreakfast: backendReservation.value.isDepartureBreakfast,
        commentMeals: backendReservation.value.commentMeals
      }))

      setBedId(pipe(backendReservation.value.beds, A.head, O.map(bed => bed.id)))
    }
  }, [pipe(backendReservation, O.flatMap(c => c.id))])
  useEffect(() => {
    if (reservationId === undefined) {
      dispatch(resetReservations())
      setDatesAndMeal(O.none())
      setUpdateDatesAndMeals(false)
    }
  }, [])
  const [bedId, setBedId] = useState<O.Option<number>>(O.none())

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
      {pipe(
        O.flatMap(customer, c =>
          O.all({
            age: O.some(c.age),
            firstname: c.firstname,
            lastname: c.lastname,
            id: O.some(c.id),
            email: O.some(c.email),
            phoneNumber: O.some(c.phoneNumber),
            comment: O.some(c.comment),
            updateCustomer: !updateCustomer ? O.some(updateCustomer) : O.none()
          })),
        O.match({
          onNone: () => (
            <CustomerUpdate
              customer={customer}
              setUpdateCustomer={setUpdateCustomer}
              setCustomer={setCustomer}
            />
          ),
          onSome: customer => (
            <CustomerSummary
              setUpdateCustomer={setUpdateCustomer}
              customer={customer}
            />
          )
        })
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
          && !updateCustomer && O.isSome(userId) ?
        pipe(
          customer,
          O.flatMap(c =>
            O.all({
              firstname: c.firstname,
              lastname: c.lastname,
              age: O.some(c.age),
              phoneNumber: O.some(c.phoneNumber),
              email: O.some(c.email),
              comment: O.some(c.comment),
              id: O.some(c.id)
            })
          ),
          O.map(customer => (
            <HStack justifyContent={'end'} key={''}>
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
                  handleSubmitReservation(datesAndMeal.value, O.none(), customer, userId.value)}
              >
                Finaliser la réservation sans lit
              </Button>
            </HStack>
          )),
          O.getOrNull
        ) :
        null}
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isSome(bedId) && !updateDatesAndMeals
          && !updateCustomer && O.isSome(userId) ?
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

            {pipe(
              customer,
              O.flatMap(c =>
                O.all({
                  firstname: c.firstname,
                  lastname: c.lastname,
                  age: O.some(c.age),
                  phoneNumber: O.some(c.phoneNumber),
                  email: O.some(c.email),
                  comment: O.some(c.comment),
                  id: O.some(c.id)
                })
              ),
              O.map(customer => (
                <Button
                  key={''}
                  isLoading={isLoading}
                  colorScheme={'blue'}
                  rightIcon={<CheckIcon />}
                  onClick={() =>
                    handleSubmitReservation(
                      datesAndMeal.value,
                      bedId,
                      customer,
                      userId.value
                    )}
                >
                  Finaliser la réservation
                </Button>
              )),
              O.getOrNull
            )}
          </HStack>
        ) :
        null}
    </Stack>
  )
}
