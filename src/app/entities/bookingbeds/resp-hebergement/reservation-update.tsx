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
import React, { useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
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
import { BedsChoices } from './bed-choices'
import { CustomerSummary } from './customer-summary'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices'
import { DatesAndMealsSummary } from './dates-and-meals-summary'

export interface DatesAndMeals {
  arrivalDate: string
  departureDate: string
  specialDiet: 'false' | 'true'
  isArrivalLunch: boolean
  isArrivalDinner: boolean
  isDepartureLunch: boolean
  isDepartureDinner: boolean
  comment: string
  isArrivalBreakfast: boolean
  isDepartureBreakfast: boolean
}

export interface Customer {
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: O.Option<string>
  age: O.Option<number>
}

export type BedIds = ReadonlyArray<{ id: number }>

const createIReservationWithBedIds = (
  customer: Customer,
  datesAndMeals: DatesAndMeals,
  bedId: number,
  isConfirmed?: boolean
): IBookingBeds => ({
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  arrivalDate: datesAndMeals.arrivalDate,
  // @ts-expect-error le format de la date an javascript n'est pas le même que celui de scala, on ne peut pas utiliser new Date(), obligé& de passer par un string
  departureDate: datesAndMeals.departureDate,
  specialDietNumber: datesAndMeals.specialDiet === 'true' ? 1 : 0,
  isArrivalLunch: datesAndMeals.isArrivalLunch,
  isArrivalDiner: datesAndMeals.isArrivalDinner,
  isDepartureLunch: datesAndMeals.isDepartureLunch,
  isDepartureDiner: datesAndMeals.isDepartureDinner,
  comment: datesAndMeals.comment,
  bedIds: [bedId],
  isConfirmed: isConfirmed ?? true,
  isPaid: false,
  paymentMode: '',
  personNumber: 1,
  customer: {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: O.getOrUndefined(customer.phoneNumber),
    age: O.getOrUndefined(customer.age)
  },
  isArrivalBreakfast: datesAndMeals.isArrivalBreakfast,
  isDepartureBreakfast: datesAndMeals.isDepartureBreakfast
})

export const BookingBedsUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<DatesAndMeals>>(O.none)
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none)
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)
  console.log('reservationId', reservationId)
  const handleSubmitReservation = async (
    datesAndMeal: DatesAndMeals,
    bedId: number,
    customer: Customer,
    isConfirmed: boolean
  ): Promise<void> => {
    const reservation = createIReservationWithBedIds(customer, datesAndMeal, bedId, isConfirmed)

    setIsLoading(true)
    if (reservationId !== undefined) {
      // FIXME: unsafe
      await dispatch(updateReservation({ ...reservation, id: Number(reservationId) }))
      setIsLoading(false)
    } else {
      await dispatch(createEntity({ entity: reservation, sendMail: true }))
      setIsLoading(false)
    }
  }

  const backendReservation = useAppSelector(state => state.reservation.entity)

  useEffect(() => {
    if (backendReservation.arrivalDate !== undefined) {
      setCustomer(O.some({
        id: backendReservation.customer.id,
        firstname: backendReservation.customer.firstname,
        lastname: backendReservation.customer.lastname,
        email: backendReservation.customer.email,
        phoneNumber: O.fromNullable(backendReservation.customer.phoneNumber),
        age: O.fromNullable(backendReservation.customer.age)
      }))
      setDatesAndMeal(O.some({
        arrivalDate: backendReservation.arrivalDate.toString(),
        departureDate: backendReservation.departureDate.toString(),
        specialDiet: backendReservation.specialDietNumber === 1 ? 'true' : 'false',
        isArrivalLunch: backendReservation.isArrivalLunch,
        isArrivalDinner: backendReservation.isArrivalDiner,
        isDepartureLunch: backendReservation.isDepartureLunch,
        isDepartureDinner: backendReservation.isDepartureDiner,
        comment: backendReservation.comment,
        isArrivalBreakfast: backendReservation.isArrivalBreakfast,
        isDepartureBreakfast: backendReservation.isDepartureBreakfast
      }))
      setBedId(pipe(backendReservation.beds, A.head, O.map(bed => bed.id)))
    }
  }, [backendReservation.id])
  useEffect(() => {
    pipe(
      reservationId,
      O.fromNullable,
      O.match(() => {
        dispatch(resetReservations())
        setDatesAndMeal(O.none)
        setUpdateDatesAndMeals(false)
      }, id => dispatch(getReservation(id)))
    )
  }, [])
  const [bedId, setBedId] = useState<O.Option<number>>(O.none)

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
        Votre réservation
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
          />
        ) :
        (
          <DatesAndMealsSummary
            datesAndMeals={datesAndMeal.value}
            setUpdate={setUpdateDatesAndMeals}
            setBedId={setBedId}
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
            {'Choix des lits'}
          </Heading>
        )}
      {O.isSome(customer) && O.isSome(datesAndMeal) && O.isSome(bedId) ?
        (
          <HStack justifyContent={'end'}>
            <Button as={Link} to={''} colorScheme={'red'} rightIcon={<BsTrash />}>Annuler</Button>

            <Button
              isLoading={isLoading}
              colorScheme={'blue'}
              rightIcon={<FaSave />}
              onClick={() =>
                handleSubmitReservation(
                  datesAndMeal.value,
                  bedId.value,
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
                    Le client recevra un mail de confirmation de réservation. Et les repas seront
                    comptés dans le nombre de repas prévus.
                  </ModalBody>
                  <ModalFooter justifyContent={'space-between'}>
                    <Button onClick={onClose} leftIcon={<ArrowLeftIcon />} variant="back">
                      Retour
                    </Button>
                    <Button
                      onClick={() =>
                        handleSubmitReservation(
                          datesAndMeal.value,
                          bedId.value,
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
