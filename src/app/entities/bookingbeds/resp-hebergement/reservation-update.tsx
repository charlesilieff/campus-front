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
import * as S from '@effect/schema/Schema'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { ReservationCreateSchemaWithBedIds } from 'app/shared/model/bookingBeds.model'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
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
import type { CustomerAndPersonNumberSchema } from './customer-update'
import { CustomerUpdate } from './customer-update'
import { DatesAndMealsChoices } from './dates-and-meals-choices'
import { DatesAndMealsSummary } from './dates-and-meals-summary'

export const DatesAndMeals = S.struct({
  arrivalDate: S.DateFromSelf,
  departureDate: S.DateFromSelf,
  isArrivalLunch: S.boolean,
  isArrivalDinner: S.boolean,
  isDepartureLunch: S.boolean,
  isDepartureDinner: S.boolean,
  comment: S.optional(S.string).toOption(),
  isArrivalBreakfast: S.boolean,
  isDepartureBreakfast: S.boolean,
  commentMeals: S.optional(S.string).toOption()
})

export type DatesAndMeals = S.To<typeof DatesAndMeals>

export type BedIds = ReadonlyArray<{ id: number }>

const createReservationWithBedIds = (
  customer: CustomerAndPersonNumberSchema,
  datesAndMeals: DatesAndMeals,
  selectedBeds: readonly number[],
  isConfirmed: boolean
): ReservationCreateSchemaWithBedIds => ({
  arrivalDate: new Date(datesAndMeals.arrivalDate),

  departureDate: new Date(
    isArrivalDateEqualDepartureDate(datesAndMeals.arrivalDate, datesAndMeals.departureDate) ?
      dayjs(datesAndMeals.arrivalDate, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')
        .toString() :
      datesAndMeals.departureDate
  ),
  specialDietNumber: customer.specialDietNumber,
  isArrivalLunch: datesAndMeals.isArrivalLunch,
  isArrivalDinner: datesAndMeals.isArrivalDinner,
  isDepartureLunch: datesAndMeals.isDepartureLunch,
  isDepartureDinner: datesAndMeals.isDepartureDinner,
  comment: datesAndMeals.comment,
  bedIds: [...selectedBeds],
  isConfirmed,
  isPaid: false,
  personNumber: customer.personNumber,

  customer: {
    id: customer.id,
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    phoneNumber: customer.phoneNumber,
    age: customer.age,
    comment: O.none()
  },
  isArrivalBreakfast: datesAndMeals.isArrivalBreakfast,
  isDepartureBreakfast: datesAndMeals.isDepartureBreakfast,
  commentMeals: datesAndMeals.commentMeals
})

export const ReservationUpdate = (): JSX.Element => {
  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<DatesAndMeals>>(O.none)
  const [customer, setCustomer] = useState<O.Option<CustomerAndPersonNumberSchema>>(O.none)
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBeds, setSelectedBeds] = useState<readonly number[]>([])
  const { reservationId } = useParams<{ reservationId: string | undefined }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)
  const handleSubmitReservation = async (
    datesAndMeal: DatesAndMeals,
    selectedBeds: readonly number[],
    customer: CustomerAndPersonNumberSchema,
    isConfirmed: boolean
  ): Promise<void> => {
    const reservation = createReservationWithBedIds(
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

  const backendReservation = useAppSelector(state => state.reservation.entity)

  useEffect(() => {
    pipe(
      O.map(
        backendReservation,
        r => {
          O.map(r.customer, customer =>
            setCustomer(O.map(customer.id, id => ({
              id: O.some(id),

              firstname: customer.firstname,

              lastname: customer.lastname,

              email: customer.email,

              phoneNumber: customer.phoneNumber,

              age: customer.age,

              personNumber: r.personNumber,

              specialDietNumber: r.specialDietNumber
            }))))

          setDatesAndMeal(O.some({
            arrivalDate: r.arrivalDate,

            departureDate: r.departureDate,
            specialDiet: r.specialDietNumber,
            isArrivalLunch: r.isArrivalLunch,
            isArrivalDinner: r.isArrivalDinner,
            isDepartureLunch: r.isDepartureLunch,
            isDepartureDinner: r.isDepartureDinner,
            comment: r.comment,
            isArrivalBreakfast: r.isArrivalBreakfast,
            isDepartureBreakfast: r.isDepartureBreakfast,
            commentMeals: r.commentMeals
          }))
          setSelectedBeds(pipe(r.beds, A.map(bed => bed.id)))
        }
      )
    )
  }, [pipe(backendReservation, O.map(reservation => reservation.arrivalDate), O.getOrUndefined)])

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
                Finaliser la réservation {selectedBeds.length === 0 ? `sans lits` : ''}
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
