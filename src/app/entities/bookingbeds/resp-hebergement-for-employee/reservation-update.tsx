import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, Text, useToast } from '@chakra-ui/react'
import type { ParseError } from '@effect/schema/ParseResult'
import * as S from '@effect/schema/Schema'
import type { Customer } from 'app/shared/model/customer.model'
import { MealsOnlyUserReservation } from 'app/shared/model/mealsReservation.model'
import axios from 'axios'
import { Effect as T, Option as O, pipe } from 'effect'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { AxiosError } from '../AxiosError'
import type {
  MealsOnlyReservationDatesAndMeals
} from '../models/OneBedReservationDatesAndMeals'
import { UserSummary } from '../resp-hebergement-for-habitant/user-summary'
import { createUserMealsOnlyReservation } from '../utils'
import { CustomerSummary } from './customer-summary'
import type { CustomerForm } from './customer-update'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices-user'
import { DatesAndMealsSummary } from './dates-and-meals-summary-user'
import { UserSelect } from './user-select'

export interface User {
  id: number
  firstName: O.Option<string>
  lastName: O.Option<string>
  email: string
  customerId: O.Option<number>
}

export type BedIds = ReadonlyArray<{ id: number }>

const apiReservation = 'api/reservations/employee'
const apiUrlMealsOnlyUserReservation = 'api/meals-only-with-user/bookingbeds'

export const createMealsOnlyReservationReservationUpdateUser = (
  mealsOnlyReservation: MealsOnlyUserReservation
) => {
  const requestUrl = `${apiUrlMealsOnlyUserReservation}`
  return pipe(
    T.tryPromise(
      () =>
        axios.post<MealsOnlyUserReservation>(
          requestUrl,
          S.encodeSync(MealsOnlyUserReservation)(mealsOnlyReservation)
        )
    ),
    T.catchAll(e =>
      pipe(
        e,
        S.parseResult(AxiosError),
        T.flatMap(e => T.fail(console.log(e.code)))
      )
    )
  )
}

export const updateMealsOnlyReservationReservationUpdateUser = (
  { mealsOnlyReservation, reservationId }: {
    mealsOnlyReservation: MealsOnlyUserReservation
    reservationId: number
  }
) => {
  const requestUrl = `${apiUrlMealsOnlyUserReservation}/${reservationId}`
  return pipe(
    T.tryPromise(
      () =>
        axios.put<MealsOnlyUserReservation>(
          requestUrl,
          S.encodeSync(MealsOnlyUserReservation)({
            ...mealsOnlyReservation,
            reservationId: O.some(reservationId)
          })
        )
    ),
    T.catchAll(e =>
      pipe(
        e,
        S.parseResult(AxiosError),
        T.flatMap(e => T.fail(console.log(e.code)))
      )
    )
  )
}

const getReservation = (id: number): T.Effect<never, void | ParseError, MealsOnlyUserReservation> =>
  pipe(
    T.promise(
      () => axios.get(`${apiReservation}/${id}`)
    ),
    T.flatMap(d => S.parseResult(MealsOnlyUserReservation)(d.data))
  )

export const ReservationEmployeeUpdate = (): JSX.Element => {
  const reservationId = pipe(
    useParams<{ reservationId: string }>(),
    param => O.fromNullable(param.reservationId),
    O.map(Number)
  )
  const [datesAndMeal, setDatesAndMeal] = useState<
    O.Option<MealsOnlyReservationDatesAndMeals>
  >(
    O.none()
  )
  const [customer, setCustomer] = useState<O.Option<CustomerForm>>(O.none())
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [selectUser, setSelectUser] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const toast = useToast()

  const [userId, setUserId] = useState<O.Option<number>>(O.none())

  const handleSubmitReservation = async (
    datesAndMeal: MealsOnlyReservationDatesAndMeals,
    customer: Customer,
    userId: number
  ): Promise<void> => {
    setIsLoading(true)
    const reservation = createUserMealsOnlyReservation(customer, datesAndMeal, userId)
    await pipe(
      reservationId,
      O.match({
        onNone: () =>
          pipe(
            createMealsOnlyReservationReservationUpdateUser(reservation),
            T.map(_ => {
              toast({
                position: 'top',
                title: 'Réservation crée !',
                description: 'A bientôt !',
                status: 'success',
                duration: 9000,
                isClosable: true
              })
            })
          ),
        onSome: reservationId =>
          pipe(
            updateMealsOnlyReservationReservationUpdateUser({
              mealsOnlyReservation: reservation,
              reservationId
            }),
            T.map(_ => {
              toast({
                position: 'top',
                title: 'Réservation modifiée !',
                description: 'A bientôt !',
                status: 'success',
                duration: 9000,
                isClosable: true
              })
            })
          )
      }),
      x => x,
      T.mapBoth({
        onFailure: _ =>
          toast({
            position: 'top',
            title: 'Réservation non crée/modifiée !',
            description: 'Le salarié a déjà une réservation pour cette période',
            status: 'error',
            duration: 9000,
            isClosable: true
          }),
        onSuccess(_) {
          navigate('/planning')
        }
      }),
      T.as(setIsLoading(false)),
      T.runPromise
    )
  }

  useEffect(() => {
    pipe(
      reservationId,
      O.map(a =>
        pipe(
          a,
          getReservation,
          T.map(reservation => {
            setCustomer(
              O.some({
                age: reservation.customer.age,
                firstName: O.some(reservation.customer.firstName),
                lastName: O.some(reservation.customer.lastName),
                email: reservation.customer.email,
                phoneNumber: reservation.customer.phoneNumber,
                id: reservation.customer.id,
                comment: reservation.customer.comment
              })
            )

            setDatesAndMeal(
              O.some({
                arrivalDate: reservation.arrivalDate,
                departureDate: reservation.departureDate,
                isSpecialDiet: reservation.isSpecialDiet ? 'true' : 'false',
                weekMeals: {
                  friday: { isLunch: true, isDinner: false, isBreakfast: false },
                  saturday: { isLunch: true, isDinner: false, isBreakfast: false },
                  sunday: { isLunch: true, isDinner: false, isBreakfast: false },
                  monday: { isLunch: true, isDinner: false, isBreakfast: false },
                  tuesday: { isLunch: true, isDinner: false, isBreakfast: false },
                  wednesday: { isLunch: true, isDinner: false, isBreakfast: false },
                  thursday: { isLunch: true, isDinner: false, isBreakfast: false }
                },
                comment: reservation.comment,
                commentMeals: reservation.commentMeals
              })
            )

            setSelectUser(false)

            setUserId(O.some(reservation.userId))
            setUpdateCustomer(false)
          }),
          T.runPromise
        )
      )
    )
  }, [])

  return (
    <Stack>
      <Heading size={'lg'} m={4}>
        {O.isSome(reservationId) ? 'Modifier' : `Créer`} une réservation pour un salarié
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
        (pipe(
          O.flatMap(customer, c =>
            O.all({
              age: O.some(c.age),
              firstName: c.firstName,
              lastName: c.lastName,
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
        ))}

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
      <Text color={'red'} px={4} fontWeight={'bold'}>
        {O.isSome(reservationId) ?
          'Les modifications des repas seront effectuées uniquement pour les dates ajoutés à la réservation.' :
          null}
      </Text>
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
            {pipe(
              O.flatMap(customer, c =>
                O.all({
                  age: O.some(c.age),
                  firstName: c.firstName,
                  lastName: c.lastName,
                  id: O.some(c.id),
                  email: O.some(c.email),
                  phoneNumber: O.some(c.phoneNumber),
                  comment: O.some(c.comment),
                  updateCustomer: !updateCustomer ? O.some(updateCustomer) : O.none()
                })),
              O.map(customer => (
                <Button
                  isLoading={isLoading}
                  colorScheme={'blue'}
                  rightIcon={<CheckIcon />}
                  key={'e'}
                  onClick={() =>
                    handleSubmitReservation(
                      datesAndMeal.value,
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
