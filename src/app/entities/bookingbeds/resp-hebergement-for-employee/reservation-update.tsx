import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, Text, useToast } from '@chakra-ui/react'
import { flow, identity, pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as T from '@effect/io/Effect'
import type { ParseError } from '@effect/schema/ParseResult'
import * as S from '@effect/schema/Schema'
import type { Customer } from 'app/shared/model/customer.model'
import { MealsOnlyUserReservation } from 'app/shared/model/mealsReservation.model'
import axios from 'axios'
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
  firstname: O.Option<string>
  lastname: O.Option<string>
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
    T.tryCatchPromise(
      () =>
        axios.post<MealsOnlyUserReservation>(
          requestUrl,
          S.encode(MealsOnlyUserReservation)(mealsOnlyReservation)
        ),
      identity
    ),
    T.catchAll(e =>
      pipe(
        e,
        S.parseEffect(AxiosError),
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
    T.tryCatchPromise(
      () =>
        axios.put<MealsOnlyUserReservation>(
          requestUrl,
          S.encode(MealsOnlyUserReservation)({
            ...mealsOnlyReservation,
            reservationId: O.some(reservationId)
          })
        ),
      identity
    ),
    T.catchAll(e =>
      pipe(
        e,
        S.parseEffect(AxiosError),
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
    T.flatMap(d => S.parseEffect(MealsOnlyUserReservation)(d.data))
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
      O.match(
        () => createMealsOnlyReservationReservationUpdateUser(reservation),
        reservationId =>
          updateMealsOnlyReservationReservationUpdateUser({
            mealsOnlyReservation: reservation,
            reservationId
          })
      ),
      T.mapBoth(_ =>
        toast({
          position: 'top',
          title: 'Réservation non crée/modifié !',
          description: 'Le salarié a déjà une réservation pour cette période',
          status: 'error',
          duration: 9000,
          isClosable: true
        }), _ => {
        toast({
          position: 'top',
          title: 'Réservation crée !',
          description: 'A bientôt !',
          status: 'success',
          duration: 9000,
          isClosable: true
        })
        navigate('/planning')
      }),
      T.as(setIsLoading(false)),
      T.runPromise
    )
  }

  useEffect(() => {
    pipe(
      reservationId,
      O.map(flow(
        getReservation,
        T.map(reservation => {
          setCustomer(
            O.some({
              age: reservation.customer.age,
              firstname: O.some(reservation.customer.firstname),
              lastname: O.some(reservation.customer.lastname),
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
              comment: O.getOrElse(reservation.comment, () => ''),
              commentMeals: O.getOrElse(reservation.commentMeals, () => '')
            })
          )

          setSelectUser(false)

          setUserId(O.some(reservation.userId))
          setUpdateCustomer(false)
        }),
        T.runPromise
      ))
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
            O.struct({
              age: O.some(c.age),
              firstname: c.firstname,
              lastname: c.lastname,
              id: O.some(c.id),
              email: O.some(c.email),
              phoneNumber: O.some(c.phoneNumber),
              comment: O.some(c.comment),
              updateCustomer: !updateCustomer ? O.some(updateCustomer) : O.none()
            })),
          O.match(() => (
            <CustomerUpdate
              customer={customer}
              setUpdateCustomer={setUpdateCustomer}
              setCustomer={setCustomer}
            />
          ), customer => (
            <CustomerSummary
              setUpdateCustomer={setUpdateCustomer}
              customer={customer}
            />
          ))
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
                O.struct({
                  age: O.some(c.age),
                  firstname: c.firstname,
                  lastname: c.lastname,
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
