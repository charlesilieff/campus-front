import { ArrowLeftIcon, CheckIcon } from '@chakra-ui/icons'
import {
  Button,
  Heading,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IBookingBeds } from 'app/shared/model/bookingBeds.model'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import {
  getReservation
} from '../../reservation/reservation.reducer'
import {
  createEntity,
  reset as resetReservations,
  updateEntity as updateReservation
} from '../booking-beds.reducer'
import { isArrivalDateEqualDepartureDate } from '../utils'
import { BedsChoices } from './bed-choices'
import { CustomerSummary } from './customer-summary'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices'
import { DatesAndMealsSummary } from './dates-and-meals-summary'

export interface DatesAndMeals {
  arrivalDate: string
  departureDate: string
  isArrivalLunch: boolean
  isArrivalDinner: boolean
  isDepartureLunch: boolean
  isDepartureDinner: boolean
  comment: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
  commentMeals: string
}

export interface Customer {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: O.Option<string>
  age: O.Option<number>
  personNumber: number
  specialDietNumber: number
}

export type BedIds = ReadonlyArray<{ id: number }>

const createIReservationWithBedIds = (
  customer: Customer,
  datesAndMeals: DatesAndMeals,
  selectedBeds: readonly number[],
  isConfirmed: boolean
): IBookingBeds => ({
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  arrivalDate: datesAndMeals.arrivalDate,
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  departureDate:
    isArrivalDateEqualDepartureDate(datesAndMeals.arrivalDate, datesAndMeals.departureDate) ?
      dayjs(datesAndMeals.arrivalDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')
        .toString() :
      datesAndMeals.departureDate,
  specialDietNumber: customer.specialDietNumber,
  isArrivalLunch: datesAndMeals.isArrivalLunch,
  isArrivalDiner: datesAndMeals.isArrivalDinner,
  isDepartureLunch: datesAndMeals.isDepartureLunch,
  isDepartureDiner: datesAndMeals.isDepartureDinner,
  comment: datesAndMeals.comment,
  bedIds: [...selectedBeds],
  isConfirmed,
  isPaid: false,
  paymentMode: '',
  personNumber: customer.personNumber,
  // @ts-expect-error TODO: fix this
  customer: {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: O.getOrUndefined(customer.phoneNumber),
    age: O.getOrUndefined(customer.age)
  },
  isArrivalBreakfast: datesAndMeals.isArrivalBreakfast,
  isDepartureBreakfast: datesAndMeals.isDepartureBreakfast,
  commentMeals: datesAndMeals.commentMeals
})

export const ReservationUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<DatesAndMeals>>(O.none)
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none)
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const { reservationId } = useParams<{ reservationId: string | undefined }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)
  const handleSubmitReservation = async (
    datesAndMeal: DatesAndMeals,
    selectedBeds: readonly number[],
    customer: Customer,
    isConfirmed: boolean
  ): Promise<void> => {
    const reservation = createIReservationWithBedIds(
      customer,
      datesAndMeal,
      selectedBeds,
      isConfirmed
    )

    setIsLoading(true)
    if (reservationId !== undefined) {
      await dispatch(updateReservation({ ...reservation, id: Number(reservationId) }))
      setIsLoading(false)
    } else {
      await dispatch(createEntity({ entity: reservation, sendMail: true }))
      setIsLoading(false)
    }
  }

  const backendReservation = O.fromNullable(useAppSelector(state => state.reservation.entity))

  useEffect(() => {
    if (O.isSome(backendReservation) && backendReservation.value.arrivalDate !== undefined) {
      // @ts-expect-error TODO: fix this
      setCustomer(O.some({
        // @ts-expect-error TODO: fix this
        id: backendReservation.value.customer.id,
        // @ts-expect-error TODO: fix this
        firstname: backendReservation.value.customer.firstname,
        // @ts-expect-error TODO: fix this
        lastname: backendReservation.value.customer.lastname,
        // @ts-expect-error TODO: fix this
        email: backendReservation.value.customer.email,
        // @ts-expect-error TODO: fix this
        phoneNumber: O.fromNullable(backendReservation.value.customer.phoneNumber),
        // @ts-expect-error TODO: fix this
        age: O.fromNullable(backendReservation.value.customer.age),

        personNumber: backendReservation.value.personNumber,

        specialDietNumber: backendReservation.value.specialDietNumber
      }))
      // @ts-expect-error TODO: fix this
      setDatesAndMeal(O.some({
        arrivalDate: backendReservation.value.arrivalDate.toString(),
        // @ts-expect-error TODO: fix this
        departureDate: backendReservation.value.departureDate.toString(),
        specialDiet: backendReservation.value.specialDietNumber,
        isArrivalLunch: backendReservation.value.isArrivalLunch,
        isArrivalDinner: backendReservation.value.isArrivalDiner,
        isDepartureLunch: backendReservation.value.isDepartureLunch,
        isDepartureDinner: backendReservation.value.isDepartureDiner,
        comment: backendReservation.value.comment,
        isArrivalBreakfast: backendReservation.value.isArrivalBreakfast,
        isDepartureBreakfast: backendReservation.value.isDepartureBreakfast,
        commentMeals: backendReservation.value.commentMeals
      }))
      // @ts-expect-error TODO: fix this
      setSelectedBeds(pipe(backendReservation.value.beds, A.map(bed => bed.id)))
    }
  }, [pipe(backendReservation, O.map(reservation => reservation.arrivalDate), O.getOrUndefined)])
  const [selectedBeds, setSelectedBeds] = useState<readonly number[]>([])
  useEffect(() => {
    pipe(
      reservationId,
      O.fromNullable,
      O.match(() => {
        dispatch(resetReservations())
        setDatesAndMeal(O.none())
        setCustomer(O.none())
        setUpdateDatesAndMeals(false)
      }, id => dispatch(getReservation(id)))
    )
  }, [])

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
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Stack>
      <Heading size={'lg'} m={4}>
        {reservationId === undefined ? 'Nouvelle' : 'Modifiez la'} réservation
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
            setSelectedBeds={setSelectedBeds}
          />
        ) :
        (
          <DatesAndMealsSummary
            datesAndMeals={datesAndMeal.value}
            setUpdate={setUpdateDatesAndMeals}
          />
        )}
      {(O.isSome(datesAndMeal) && !isArrivalDateEqualDepartureDate(
          datesAndMeal.value.arrivalDate,
          datesAndMeal.value.departureDate
        )) && !updateDatesAndMeals ?
        (
          <BedsChoices
            datesAndMeals={datesAndMeal}
            selectedBeds={selectedBeds}
            selectBed={bedId => {
              !selectedBeds.includes(bedId) ?
                pipe(selectedBeds, A.append(bedId), d => setSelectedBeds(d)) :
                pipe(selectedBeds, A.filter(id => id !== bedId), setSelectedBeds)
            }}
            reservationId={O.fromNullable(reservationId)}
            personNumber={pipe(customer, O.map(c => +c.personNumber), O.getOrElse(() => 0))}
            // @ts-expect-error TODO: fix this
            reservationBeds={pipe(
              backendReservation,
              O.flatMap(r => pipe(O.fromNullable(r.beds), O.map(b => b.map(x => x.id)))),
              O.getOrElse(() => [])
            )}
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
      {O.isSome(customer) && O.isSome(datesAndMeal)
          && (!updateDatesAndMeals || isArrivalDateEqualDepartureDate(
            datesAndMeal.value.arrivalDate,
            datesAndMeal.value.departureDate
          )) && !updateCustomer ?
        (
          <HStack justifyContent={'end'}>
            <Button
              isLoading={isLoading}
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
              rightIcon={<FaSave />}
              onClick={() =>
                handleSubmitReservation(
                  datesAndMeal.value,
                  selectedBeds,
                  customer.value,
                  false
                )}
            >
              Enregistrer le brouillon
            </Button>
            <>
              <Button
                isLoading={isLoading}
                variant={'save'}
                rightIcon={<CheckIcon />}
                onClick={onOpen}
              >
                Finaliser la réservation
              </Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>
                    Confirmer la réservation
                  </ModalHeader>
                  <ModalBody>
                    La première fois le client recevra un mail de confirmation de réservation. Et
                    les repas seront comptés dans le nombre de repas prévus.
                  </ModalBody>
                  <ModalFooter justifyContent={'space-between'}>
                    <Button
                      onClick={onClose}
                      leftIcon={<ArrowLeftIcon />}
                      variant="back"
                      isLoading={isLoading}
                    >
                      Retour
                    </Button>
                    <Button
                      isLoading={isLoading}
                      onClick={() =>
                        handleSubmitReservation(
                          datesAndMeal.value,
                          selectedBeds,
                          customer.value,
                          true
                        )}
                      leftIcon={<FaSave />}
                      variant="save"
                    >
                      Enregistrer
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          </HStack>
        ) :
        null}
    </Stack>
  )
}
