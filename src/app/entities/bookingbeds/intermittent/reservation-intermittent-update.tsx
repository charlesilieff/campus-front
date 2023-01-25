import { CheckIcon } from '@chakra-ui/icons'
import { Button, Heading, HStack, Stack, useToast } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { IReservation } from 'app/shared/model/reservation.model'
import { Option as O, pipe } from 'effect'
import React, { useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getEntity as getCustomerEntity } from '../../customer/customer.reducer'
import { createEntity, reset } from '../booking-beds.reducer'
import { BedsChoices } from './bed-choices'
import { CustomerSummary } from './customer-summary'
import { CustomerUpdate } from './customer-update'
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
  id: number
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
  age: O.Option<number>
}

export type BedIds = ReadonlyArray<{ id: number }>

export const ReservationIntermittentUpdate = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const toast = useToast()
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)

  const createIReservation = (
    customer: O.Option<Customer>,
    datesAndMeals: O.Option<DatesAndMeals>,
    bedId: O.Option<number>
  ): O.Option<IReservation> =>
    pipe(
      O.struct({ customer, datesAndMeals, bedId }),
      O.map(({ customer, datesAndMeals, bedId }) => {
        const reservation: IReservation = {
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
          beds: [{ id: bedId }],
          isConfirmed: true,
          isPaid: false,
          isLunchOnly: false,
          paymentMode: '',
          personNumber: 1,
          customer: {
            id: customer.id,
            firstname: customer.firstname,
            lastname: customer.lastname,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            age: O.getOrUndefined(customer.age),
            isFemal: false
          }
        }

        return reservation
      })
    )

  const handleSubmitReservation = (
    datesAndMeal: O.Option<DatesAndMeals>,
    bedId: O.Option<number>,
    customer: O.Option<Customer>
  ): void => {
    const reservation = createIReservation(customer, datesAndMeal, bedId)
    if (O.isSome(reservation)) {
      setIsLoading(true)
      dispatch(createEntity(reservation.value)).then(() => setIsLoading(false))
    } else {
      alert('Veuillez remplir tous les champs')
    }
  }

  useEffect(() => {
    id !== undefined ? dispatch(getCustomerEntity(id)) : null
    pipe(
      id,
      O.fromNullable,
      O.map(id => dispatch(getCustomerEntity(id))),
      O.map(_ => useAppSelector(state => state.customer.entity)),
      O.map(c =>
        setCustomer(O.some({
          id: c?.id,
          firstname: c?.firstname,
          lastname: c?.lastname,
          email: c?.email,
          phoneNumber: c?.phoneNumber,
          age: O.some(c?.age)
        }))
      )
    )
  }, [])

  const [datesAndMeal, setDatesAndMeal] = useState<O.Option<DatesAndMeals>>(O.none)
  const [customer, setCustomer] = useState<O.Option<Customer>>(O.none)
  const [updateDatesAndMeals, setUpdateDatesAndMeals] = useState<boolean>(false)
  const [updateCustomer, setUpdateCustomer] = useState<boolean>(false)

  const [bedId, setBedId] = useState<O.Option<number>>(O.none)

  useEffect(() => {
    if (updateSuccess) {
      dispatch(reset())
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
  // const testValue = {
  //   arrivalDate: '2021-22-02',
  //   departureDate: '2021-22-03',
  //   specialDiet: 'false' as const,
  //   isArrivalLunch: true,
  //   isArrivalDinner: false,
  //   isDepartureLunch: true,
  //   isDepartureDinner: false,
  //   comment: 'test'
  // }

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
      {O.isNone(datesAndMeal) || updateDatesAndMeals ?
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
      {O.isSome(datesAndMeal) && !updateDatesAndMeals ?
        (
          <BedsChoices
            datesAndMeals={datesAndMeal}
            setSelectedBedId={setBedId}
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
              rightIcon={<CheckIcon />}
              onClick={() => handleSubmitReservation(datesAndMeal, bedId, customer)}
            >
              Finaliser la réservation
            </Button>
          </HStack>
        ) :
        null}
    </Stack>
  )
}

export default ReservationIntermittentUpdate
