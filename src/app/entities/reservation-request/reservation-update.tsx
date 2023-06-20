// eslint-disable-next-line simple-import-sort/imports
import { Button, Heading, HStack, Stack, Text, useToast, VStack } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as T from '@effect/io/Effect'
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { Customer } from 'app/shared/model/customer.model'
import type { ReservationRequest } from 'app/shared/model/reservation-request.model'
import type { Reservation } from 'app/shared/model/reservation.model'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { isArrivalDateEqualDepartureDate } from '../bookingbeds/utils'
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

export type BedIds = ReadonlyArray<{ id: number }>

const createReservationRequest = (
  customer: Customer,
  reservation: Reservation,
  UUID: O.Option<string>
): ReservationRequest => ({
  reservation: {
    id: reservation.id,
    beds: reservation.beds,
    arrivalDate: reservation.arrivalDate,
    customer: O.none(),
    departureDate: reservation.departureDate,
    specialDietNumber: reservation.specialDietNumber,
    isArrivalLunch: reservation.isArrivalLunch,
    isArrivalDinner: reservation.isArrivalDinner,
    isDepartureLunch: reservation.isDepartureLunch,
    isDepartureDinner: reservation.isDepartureDinner,
    comment: reservation.comment,
    isConfirmed: false,
    isPaid: false,
    paymentMode: O.none(),
    personNumber: reservation.personNumber,
    reservationNumber: UUID,
    isArrivalBreakfast: reservation.isArrivalBreakfast,
    isDepartureBreakfast: reservation.isDepartureBreakfast,
    commentMeals: reservation.commentMeals,
    userCategoryId: O.some(3)
  },

  customer: {
    comment: customer.comment,
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    age: customer.age
  }
})

export const ReservationRequestUpdate = (): JSX.Element => {
  const [reservation, setReservation] = useState<O.Option<Reservation>>(O.none)
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none)
  const [updateReservation, setUpdateReservation] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const { uuid: uuidParam } = useParams<'uuid'>()

  const [uuid, setUUID] = useState<O.Option<string>>(O.fromNullable(uuidParam))
  console.log(uuid)
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
    const reservationRequest = createReservationRequest(customer, {
      ...reservation,
      departureDate:
        isArrivalDateEqualDepartureDate(reservation.arrivalDate, reservation.departureDate) ?
          new Date(
            dayjs(reservation.arrivalDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')
          ) :
          reservation.departureDate
    }, uuid)

    setIsLoading(true)

    if (O.isSome(uuid)) {
      await dispatch(updateEntity(reservationRequest))
      setIsLoading(false)
      setUpdateSuccess(true)
    } else {
      const payload = await pipe(
        T.promise(() => dispatch(createEntity(reservationRequest))),
        T.map(d => d.payload),
        T.map(S.parse(S.optionFromSelf(S.string))),
        T.runPromise
      )
      setIsLoading(false)
      setUpdateSuccess(true)

      setUUID(payload)
    }
  }

  useEffect(() => {
    pipe(
      reservationRequest,
      O.match(() => {
        setReservation(O.none())
        setCustomer(O.none())
      }, reservationRequest => {
        setReservation(O.some({
          paymentMode: O.none(),
          beds: reservationRequest.reservation.beds,
          customer: O.none(),
          isConfirmed: reservationRequest.reservation.isConfirmed,
          isPaid: reservationRequest.reservation.isPaid,
          id: reservationRequest.reservation.id,

          reservationNumber: reservationRequest.reservation.reservationNumber,

          arrivalDate: reservationRequest.reservation.arrivalDate,

          departureDate: reservationRequest.reservation.departureDate,

          personNumber: reservationRequest.reservation.personNumber,

          specialDietNumber: reservationRequest.reservation.specialDietNumber,

          isArrivalLunch: reservationRequest.reservation.isArrivalLunch,

          isArrivalDinner: reservationRequest.reservation.isArrivalDinner,

          isDepartureDinner: reservationRequest.reservation.isDepartureDinner,

          isDepartureLunch: reservationRequest.reservation.isDepartureLunch,

          comment: reservationRequest.reservation.comment,

          isArrivalBreakfast: reservationRequest.reservation.isArrivalBreakfast,

          isDepartureBreakfast: reservationRequest.reservation.isDepartureBreakfast,

          commentMeals: reservationRequest.reservation.commentMeals,
          userCategoryId: O.some(3)
        }))

        setCustomer(O.some({
          age: reservationRequest.customer.age,
          email: reservationRequest.customer.email,
          firstname: reservationRequest.customer.firstname,
          id: reservationRequest.customer.id,
          lastname: reservationRequest.customer.lastname,
          phoneNumber: reservationRequest.customer.phoneNumber,
          comment: reservationRequest.customer.comment
        }))
      })
    )
    pipe(
      uuid,
      O.match(() => {
        setReservation(O.none())
        setCustomer(O.none())
      }, uuid => dispatch(getReservationRequest(uuid)))
    )
  }, [pipe(reservationRequest, O.flatMap(r => r.reservation.reservationNumber), O.getOrNull)])
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
      if (O.isSome(uuid)) {
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
                to={`/reservation-request/${O.getOrNull(uuid)}`}
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
