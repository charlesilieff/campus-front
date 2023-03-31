import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  useToast,
  VStack
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getPricings } from 'app/entities/pricing/pricing.reducer'
import type { ICustomer } from 'app/shared/model/customer.model'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useNavigate, useParams } from 'react-router-dom'

import type { IBookingBeds } from '../../shared/model/bookingBeds.model'
import { getReservationsWithBedEntity, reset, setData } from './booking-beds.reducer'
import { isArrivalDateIsBeforeDepartureDate } from './utils'

export const ReservationCustomerUpdate = () => {
  const reservationEntity = useAppSelector(state => state.bookingBeds.entity)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm,
    watch
  } = useForm<IBookingBeds>({})

  useEffect(() => {
    resetForm(defaultValues())
  }, [reservationEntity.id])
  const personNumber = useRef({})
  personNumber.current = watch('personNumber', 0)

  const dispatch = useAppDispatch()
  const toast = useToast()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined

  const creating = useAppSelector(state => state.bookingBeds.creating)

  const loading = useAppSelector(state => state.bookingBeds.loading)
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)

  const handleClose = () => {
    navigate('/planning')
  }
  const departureDate = useRef({})
  departureDate.current = watch('departureDate')
  useEffect(() => {
    if (!creating) {
      if (isNew) {
        dispatch(reset())
      } else {
        dispatch(getReservationsWithBedEntity(id))
      }
    }

    dispatch(getPricings())
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      if (isNew) {
        toast({
          position: 'top',
          title: 'Réservation crée !',
          description: 'La réservation a bien été crée.',
          status: 'success',
          duration: 4000,
          isClosable: true
        })
      } else {
        toast({
          position: 'top',
          title: 'Réservation modifiée !',
          description: 'La réservation a bien été modifiée.',
          status: 'success',
          duration: 4000,
          isClosable: true
        })
      }
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = (values: IBookingBeds) => {
    const customer: ICustomer = {
      id: reservationEntity?.customer?.id,
      firstname: values.firstname,
      lastname: values.lastname,
      // @ts-expect-error : age is a number
      age: values.age === '' ? undefined : values.age,
      comment: values.customerComment,
      email: values.email,
      phoneNumber: values.phoneNumber
    }

    const reservation: IBookingBeds = {
      ...reservationEntity,
      arrivalDate: values.arrivalDate,
      departureDate: values.departureDate,
      isArrivalDiner: values.isArrivalDiner,
      isArrivalLunch: values.isArrivalLunch,
      isDepartureDiner: values.isDepartureDiner,
      isDepartureLunch: values.isDepartureLunch,
      comment: values.reservationComment,
      personNumber: values.personNumber,
      specialDietNumber: values.specialDietNumber,

      customer,
      isArrivalBreakfast: values.isArrivalBreakfast,
      isDepartureBreakfast: values.isDepartureBreakfast
    }

    dispatch(setData(reservation))
  }

  const defaultValues = () => ({
    isArrivalDiner: true,
    isDepartureDiner: false,
    isArrivalLunch: true,
    isDepartureLunch: true,
    reservationComment: reservationEntity?.comment ?? '',
    customerComment: reservationEntity?.customer?.comment ?? '',
    pricingId: reservationEntity?.pricing?.id ?? null,
    firstname: reservationEntity?.customer?.firstname ?? '',
    lastname: reservationEntity?.customer?.lastname ?? '',
    age: reservationEntity?.customer?.age ?? null,
    email: reservationEntity?.customer?.email ?? '',
    phoneNumber: reservationEntity?.customer?.phoneNumber ?? null,
    personNumber: reservationEntity?.personNumber ?? null,
    specialDietNumber: reservationEntity?.specialDietNumber ?? null,
    ...reservationEntity,
    ...reservationEntity.customer
  })

  return (
    <VStack>
      <Heading>
        {`${isNew ? 'Créer' : 'Modifier'} la réservation et le client`}
      </Heading>

      {loading ? <p>Chargement...</p> : (
        <form onSubmit={handleSubmit(saveEntity)}>
          <VStack minW={'300px'}>
            <HStack>
              <Button
                as={Link}
                variant="back"
                to="/planning"
                onClick={() => dispatch(reset())}
              >
                Annuler
              </Button>
              &nbsp;
              <Button variant={'save'} type="submit" leftIcon={<FaSave />}>
                Suivant
              </Button>
            </HStack>
            <FormControl isRequired isInvalid={errors.lastname !== undefined}>
              <FormLabel htmlFor="firstname" fontWeight={'bold'}>
                {'Prénom'}
              </FormLabel>
              <Input
                id="firstname"
                type="text"
                placeholder="Prénom"
                {...register('firstname', {
                  required: 'Le prénom est obligatoire',
                  minLength: {
                    value: 1,
                    message: 'This field is required to be at least 1 characters.'
                  },
                  maxLength: {
                    value: 50,
                    message: 'This field cannot be longer than 50 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.firstname && errors.firstname.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.lastname !== undefined}>
              <FormLabel htmlFor="lastname" fontWeight={'bold'}>
                {'Nom'}
              </FormLabel>
              <Input
                id="lastname"
                type="text"
                placeholder="Nom"
                {...register('lastname', {
                  required: 'Le nom est obligatoire',
                  minLength: {
                    value: 1,
                    message: 'This field is required to be at least 1 characters.'
                  },
                  maxLength: {
                    value: 50,
                    message: 'This field cannot be longer than 50 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.lastname && errors.lastname.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.age !== undefined}>
              <FormLabel htmlFor="age" fontWeight={'bold'}>
                {'Age'}
              </FormLabel>
              <Input
                id="age"
                type="number"
                placeholder="Age"
                {...register('age', {})}
              />

              <FormErrorMessage>
                {errors.age && errors.age.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.phoneNumber !== undefined}>
              <FormLabel htmlFor="phoneNumber" fontWeight={'bold'}>
                {'Téléphone'}
              </FormLabel>
              <Input
                id="phoneNumber"
                type="text"
                placeholder="Téléphone"
                {...register('phoneNumber', {})}
              />

              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.email !== undefined}>
              <FormLabel htmlFor="email" fontWeight={'bold'}>
                {'Email'}
              </FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register('email', {
                  required: "L'email est obligatoire",
                  minLength: {
                    value: 1,
                    message: 'This field is required to be at least 1 characters.'
                  },
                  maxLength: {
                    value: 50,
                    message: 'This field cannot be longer than 50 characters.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.comment !== undefined}>
              <FormLabel htmlFor="comment" fontWeight={'bold'}>
                {'Remarque sur le client'}
              </FormLabel>
              <Textarea
                id="comment"
                placeholder="Commentaire"
                {...register('comment', {
                  maxLength: {
                    value: 400,
                    message: 'Ce champ ne doit pas dépasser 400 caractères.'
                  }
                })}
              />

              <FormErrorMessage>
                {errors.comment && errors.comment.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.personNumber !== undefined}>
              <FormLabel htmlFor="personNumber" fontWeight={'bold'}>
                {'Nombre de personnes à héberger'}
              </FormLabel>
              <Input
                type="number"
                {...register('personNumber', {})}
              />

              <FormErrorMessage>
                {errors.personNumber && errors.personNumber.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.specialDietNumber !== undefined}>
              <FormLabel htmlFor="specialDietNumber" fontWeight={'bold'}>
                {'Nombre de régimes sans gluten OU sans lactose.'}
              </FormLabel>
              <Input
                type="number"
                {...register('specialDietNumber', {
                  required: 'Le nombre de régimes spéciaux est obligatoire',
                  validate(v) {
                    if (v > personNumber.current) {
                      return 'Le nombre de régimes spéciaux ne peut pas être supérieur au nombre de personnes'
                    }
                    if (v < 0) {
                      return 'Le nombre de régimes spéciaux ne peut pas être négatif'
                    }
                  }
                })}
              />

              <FormErrorMessage>
                {errors.specialDietNumber && errors.specialDietNumber.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="selectionRepas" fontWeight={'bold'}>
                {'Sélection des repas :'}
              </FormLabel>
              <HStack>
                <Text fontWeight={'bold'}>{"Jour d'arrivée :"}</Text>
                <Checkbox {...register('isArrivalBreakfast')}>déjeuner</Checkbox>
                <Checkbox {...register('isArrivalLunch')}>déjeuner</Checkbox>
                <Checkbox {...register('isArrivalDiner')}>dîner</Checkbox>
              </HStack>
              <HStack>
                <Text fontWeight={'bold'}>{'Jour de départ :'}</Text>
                <Checkbox {...register('isDepartureBreakfast')}>déjeuner</Checkbox>
                <Checkbox {...register('isDepartureLunch')}>déjeuner</Checkbox>
                <Checkbox {...register('isDepartureDiner')}>dîner</Checkbox>
              </HStack>
            </FormControl>
            <FormControl isRequired isInvalid={errors.arrivalDate !== undefined}>
              <FormLabel htmlFor="arrivalDate" fontWeight={'bold'}>
                {"Date d'arrivée"}
              </FormLabel>
              <Input
                id="username"
                type="date"
                placeholder="Date d'arrivée'"
                {...register('arrivalDate', {
                  required: "la date d'arrivée' est obligatoire",
                  validate(v) {
                    if (
                      !isArrivalDateIsBeforeDepartureDate(
                        v.toString(),
                        departureDate.current.toString()
                      )
                    ) {
                      return "La date d'arrivée doit être avant la date de départ"
                    }
                  }
                })}
              />

              <FormErrorMessage>
                {errors.arrivalDate && errors.arrivalDate.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.departureDate !== undefined}>
              <FormLabel htmlFor="departureDate" fontWeight={'bold'}>
                {'Date de départ'}
              </FormLabel>
              <Input
                id="username"
                type="date"
                placeholder="Date de départ"
                {...register('departureDate', {
                  required: 'la date de départ est obligatoire'
                })}
              />

              <FormErrorMessage>
                {errors.departureDate && errors.departureDate.message}
              </FormErrorMessage>
            </FormControl>

            {!isNew ?
              (
                <Button
                  as={Link}
                  variant="back"
                  to={`/bookingbeds/${reservationEntity.id}`}
                  leftIcon={<FaArrowLeft />}
                >
                  Retour
                </Button>
              ) :
              ('')}
            <HStack>
              <Button
                as={Link}
                variant="back"
                to="/planning"
                onClick={() => dispatch(reset())}
              >
                Annuler
              </Button>

              <Button variant={'save'} type="submit" leftIcon={<FaSave />}>
                Suivant
              </Button>
            </HStack>
          </VStack>
        </form>
      )}
    </VStack>
  )
}
