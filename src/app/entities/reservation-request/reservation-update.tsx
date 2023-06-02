/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable simple-import-sort/imports */
import { Button, Heading, HStack, Stack, Text, useToast, VStack } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IReservationRequest } from 'app/shared/model/reservation-request.model'
import React, { useEffect, useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { CustomerSummary } from './customer-summary'
import { CustomerUpdate } from './customer-update'
import { ReservationChoices } from './reservation-choices'

import {
  createEntity,
  getReservationRequest,
  reset as resetReservations,
  updateEntity
} from './reservation-request.reducer'
import { DatesAndMealsSummary as ReservationSummary } from './reservation-summary'

export interface Reservation {
  id: O.Option<number>
  reservationNumber: string
  personNumber: number
  arrivalDate: string
  departureDate: string
  specialDietNumber: number
  isArrivalLunch: boolean
  isArrivalDinner: boolean
  isDepartureLunch: boolean
  isDepartureDinner: boolean
  comment: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: string
  userCategoryId: number
}

export interface Customer {
  id: O.Option<number>
  firstname: string
  lastname: string
  email: string
  phoneNumber: O.Option<string>
  age: O.Option<number>
}

export type BedIds = ReadonlyArray<{ id: number }>

const createReservationRequest = (
  customer: Customer,
  reservation: Reservation,
  UUID: string
): { ReservationRequest: IReservationRequest; UUID: string } => ({
  ReservationRequest: {
    reservation: {
      id: O.getOrUndefined(reservation.id),
      // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
      arrivalDate: reservation.arrivalDate,
      // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
      departureDate: reservation.departureDate,
      specialDietNumber: reservation.specialDietNumber,
      isArrivalLunch: reservation.isArrivalLunch,
      isArrivalDiner: reservation.isArrivalDinner,
      isDepartureLunch: reservation.isDepartureLunch,
      isDepartureDiner: reservation.isDepartureDinner,
      comment: reservation.comment,
      isConfirmed: false,
      isPaid: false,
      paymentMode: '',
      personNumber: reservation.personNumber,
      reservationNumber: UUID,
      isArrivalBreakfast: reservation.isArrivalBreakfast,
      isDepartureBreakfast: reservation.isDepartureBreakfast,
      commentMeals: reservation.commentMeals,
      userCategoryId: 3
    },
    // @ts-expect-error TODO: fix this
    customer: {
      id: O.getOrUndefined(customer.id),
      firstname: customer.firstname,
      lastname: customer.lastname,
      email: customer.email,
      phoneNumber: O.getOrUndefined(customer.phoneNumber),
      age: O.getOrUndefined(customer.age)
    }
  },
  UUID
})

export const ReservationRequestUpdate = (): JSX.Element => {
  const [reservation, setReservation] = useState<O.Option<Reservation>>(O.none)
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none)
  const [updateReservation, setUpdateReservation] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const { uuid: uuidParam } = useParams<'uuid'>()
  // @ts-expect-error TODO: fix this
  const [uuid, setUUID] = useState<string>(uuidParam ?? undefined)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [updateSuccess, setUpdateSuccess] = useState(false)

  const [isCustomerSaved, setIsCustomerSaved] = useState(true)
  const [isReservationSaved, setIsReservationSaved] = useState(true)
  const reservationRequest = useAppSelector(state => state.requestReservation.entity)

  const handleSubmitReservation = async (
    reservation: Reservation,
    customer: Customer
  ): Promise<void> => {
    const reservationRequest = createReservationRequest(customer, reservation, uuid)

    setIsLoading(true)
    if (uuid !== undefined) {
      await dispatch(updateEntity(reservationRequest))
      setIsLoading(false)
      setUpdateSuccess(true)
    } else {
      const { payload } = await dispatch(createEntity(reservationRequest.ReservationRequest))
      setIsLoading(false)
      setUpdateSuccess(true)
      // @ts-expect-error dddd
      setUUID(payload.data.reservation.reservationNumber)
    }
  }

  useEffect(() => {
    pipe(
      uuid,
      O.fromNullable,
      O.map(id => dispatch(getReservationRequest(id)))
    )

    if (reservationRequest.reservation !== undefined) {
      // @ts-expect-error TODO: fix this
      setReservation(O.some({
        // @ts-expect-error TODO: fix this
        id: O.fromNullable(reservationRequest.reservation.id),
        // @ts-expect-error TODO: fix this
        reservationNumber: reservationRequest.reservation.reservationNumber,
        // @ts-expect-error TODO: fix this
        arrivalDate: reservationRequest.reservation.arrivalDate.toString(),
        // @ts-expect-error TODO: fix this
        departureDate: reservationRequest.reservation.departureDate.toString(),
        // @ts-expect-error TODO: fix this
        personNumber: reservationRequest.reservation.personNumber,
        // @ts-expect-error TODO: fix this
        specialDietNumber: reservationRequest.reservation.specialDietNumber,
        // @ts-expect-error TODO: fix this
        isArrivalLunch: reservationRequest.reservation.isArrivalLunch,
        // @ts-expect-error TODO: fix this
        isArrivalDinner: reservationRequest.reservation.isArrivalDiner,
        // @ts-expect-error TODO: fix this
        isDepartureDinner: reservationRequest.reservation.isDepartureDiner,
        // @ts-expect-error TODO: fix this
        isDepartureLunch: reservationRequest.reservation.isDepartureLunch,
        // @ts-expect-error TODO: fix this
        comment: reservationRequest.reservation.comment,
        // @ts-expect-error TODO: fix this
        isArrivalBreakfast: reservationRequest.reservation.isArrivalBreakfast,
        // @ts-expect-error TODO: fix this
        isDepartureBreakfast: reservationRequest.reservation.isDepartureBreakfast,
        // @ts-expect-error TODO: fix this
        commentMeals: reservationRequest.reservation.commentMeals,
        userCategoryId: 3
      }))
    }

    if (reservationRequest.customer !== undefined) {
      // @ts-expect-error TODO: fix this
      setCustomer(O.some({
        // @ts-expect-error TODO: fix this
        age: O.fromNullable(reservationRequest.customer.age),
        // @ts-expect-error TODO: fix this
        email: reservationRequest.customer.email,
        // @ts-expect-error TODO: fix this
        firstname: reservationRequest.customer.firstname,
        // @ts-expect-error TODO: fix this
        id: O.fromNullable(reservationRequest.customer.id),
        // @ts-expect-error TODO: fix this
        lastname: reservationRequest.customer.lastname,
        // @ts-expect-error TODO: fix this
        phoneNumber: O.fromNullable(reservationRequest.customer.phoneNumber)
      }))
    }
  }, [reservationRequest?.reservation?.reservationNumber])
  useEffect(() => {
    if (uuid === undefined) {
      dispatch(resetReservations())
      setReservation(O.none)
      setUpdateReservation(false)
    }
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      dispatch(resetReservations())
      if (uuid !== undefined) {
        toast({
          position: 'top',
          title: 'Demande de réservation modifiée !',
          description:
            'Votre demande de modification va bien être prise en compte, vous recevrez un mail de confirmation dans les plus brefs délais.',
          status: 'success',
          duration: 9000,
          isClosable: true
        })
      } else {
        toast({
          position: 'top',
          title: 'Demande de réservation envoyé !',
          description:
            'Votre réservation va bien être prise en compte, vous recevrez un mail de confirmation dans les plus brefs délais.',
          status: 'success',
          duration: 9000,
          isClosable: true
        })
      }
    }
  }, [updateSuccess])

  return (
    <Stack>
      <Heading size={'lg'} m={4}>
        Votre demande de réservation
      </Heading>
      {updateSuccess ?
        (
          <VStack alignItems={'flex-start'}>
            <Text>
              Votre demande de réservation a bien été envoyée, vous allez recevoir une confirmation
              sous trois jours et un email pour pouvoir modifier/annuler votre demande.
            </Text>
            <Text>
              Vous pouvez aussi cliquez&nbsp;
              <Link
                to={`/reservation-request/${uuid}`}
              >
                ici
              </Link>
              &nbsp;pour gérer votre réservation.
            </Text>
          </VStack>
        ) :
        (
          <Stack>
            {O.isNone(customer) || updateCustomer ?
              (
                <CustomerUpdate
                  setIsCustomerSaved={setIsCustomerSaved}
                  customer={customer}
                  setUpdateCustomer={setUpdateCustomer}
                  setCustomer={setCustomer}
                />
              ) :
              (
                <CustomerSummary
                  isCustomerSaved={isCustomerSaved}
                  setUpdateCustomer={setUpdateCustomer}
                  customer={customer.value}
                />
              )}
            {O.isNone(customer) || (updateCustomer && O.isNone(reservation)) ?
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
                  {'Votre demande de réservation'}
                </Heading>
              ) :
              O.isNone(reservation) || updateReservation ?
              (
                <ReservationChoices
                  reservation={reservation}
                  setUpdateReservation={setUpdateReservation}
                  setReservation={setReservation}
                  setIsReservationSaved={setIsReservationSaved}
                />
              ) :
              (
                <ReservationSummary
                  datesAndMeals={reservation.value}
                  setUpdate={setUpdateReservation}
                  isReservationSaved={isReservationSaved}
                />
              )}

            {O.isSome(customer) && O.isSome(reservation) ?
              (
                <HStack justifyContent={'end'} py={2}>
                  <Button
                    isLoading={isLoading}
                    variant="save"
                    rightIcon={<FaSave />}
                    onClick={() =>
                      handleSubmitReservation({
                        ...reservation.value,
                        id: reservation.value.id ?? O.none()
                      }, customer.value)}
                  >
                    Finaliser la demande de réservation
                  </Button>
                </HStack>
              ) :
              null}
          </Stack>
        )}
    </Stack>
  )
}
