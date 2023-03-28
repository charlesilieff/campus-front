/* eslint-disable simple-import-sort/imports */
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
  VStack
} from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IReservationRequest } from 'app/shared/model/reservation-request.model'
import React, { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { isArrivalDateIsBeforeDepartureDate, isDateBeforeNow } from '../bookingbeds/utils'

import {
  backToOne,
  createEntity,
  updateEntity
} from './reservation-request.reducer'

export interface ReservationForm {
  id?: number
  personNumber?: number
  paymentMode?: string | null
  isPaid?: boolean
  isConfirmed?: boolean
  reservationNumber?: string | null
  specialDietNumber?: number
  isArrivalDiner?: boolean
  isDepartureDiner?: boolean
  isArrivalLunch?: boolean
  isDepartureLunch?: boolean
  arrivalDate?: string
  departureDate?: string
  comment?: string | null
}

export const ReservationUpdate = () => {
  const reservationEntity = useAppSelector(state => state.requestReservation.entity.reservation)
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset: resetForm,
    watch
  } = useForm<ReservationForm>({})

  useEffect(() => {
    const defaultReservationForm: ReservationForm = {
      ...defaultValues,
      arrivalDate: defaultValues?.arrivalDate?.toString(),
      departureDate: defaultValues?.departureDate?.toString()
    }

    resetForm(defaultReservationForm)
  }, [reservationEntity?.id])
  const personNumber = useRef({})
  personNumber.current = watch('personNumber', 0)
  const dispatch = useAppDispatch()
  const { uuid } = useParams<'uuid'>()

  const isNew = uuid === undefined

  const customerEntity = useAppSelector(state => state.requestReservation.entity.customer)

  const loading = useAppSelector(state => state.requestReservation.loading)
  const updateSuccess = useAppSelector(state => state.requestReservation.updateSuccess)

  const departureDate = useRef({})
  departureDate.current = watch('departureDate', null)

  const saveEntity = (values: ReservationForm): void => {
    const entity: IReservationRequest = {
      // @ts-expect-error : date is not in good format
      reservation: {
        ...reservationEntity,
        ...values
      },

      customer: {
        ...customerEntity,
        // @ts-expect-error : age is "" if not set
        age: customerEntity.age === '' ? undefined : customerEntity.age
      }
    }

    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity({ ReservationRequest: entity, UUID: uuid }))
    }
  }

  const defaultValues = {
    isArrivalDiner: true,
    isDepartureDiner: false,
    isArrivalLunch: true,
    isDepartureLunch: true,
    ...reservationEntity
  }

  const form = useForm({
    mode: 'onBlur'
  })

  return (
    <VStack>
      <Heading
        size={'md'}
      >
        Détails de votre réservation
      </Heading>

      {loading ? <p>Chargement...</p> : updateSuccess ?
        (
          <div>
            <h4>
              <p>
                Votre demande de réservation a bien été envoyée, vous allez recevoir une
                confirmation sous trois jours et un email pour pouvoir modifier/annuler votre
                demande.
              </p>{' '}
              <p>
                Vous pouvez aussi cliquez&nbsp;
                <Link
                  to={isNew ?
                    `/reservation-request/${reservationEntity?.reservationNumber}` :
                    `/reservation-request/${uuid}`}
                >
                  ici
                </Link>
                &nbsp;pour gérer votre réservation.
              </p>
            </h4>
          </div>
        ) :
        (
          <form onSubmit={handleSubmit(saveEntity)}>
            <VStack minW={'300px'}>
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
                  <Checkbox {...register('isArrivalLunch')}>déjeuner</Checkbox>
                  <Checkbox {...register('isArrivalDiner')}>dîner (soir)</Checkbox>
                </HStack>
                <HStack>
                  <Text fontWeight={'bold'}>{'Jour de départ :'}</Text>
                  <Checkbox {...register('isDepartureLunch')}>déjeuner</Checkbox>
                  <Checkbox {...register('isDepartureDiner')}>dîner (soir)</Checkbox>
                </HStack>
              </FormControl>
              <FormControl isInvalid={errors.comment !== undefined}>
                <FormLabel htmlFor="comment" fontWeight={'bold'}>
                  {'Veuillez indiquer si vous souhaitez des lits doubles, et autres demandes.'}
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
                        !isArrivalDateIsBeforeDepartureDate(v, departureDate.current.toString())
                      ) {
                        return "La date d'arrivée doit être avant la date de départ"
                      }
                      if (isDateBeforeNow(v)) {
                        return "La date d'arrivée doit être après aujourd’hui"
                      } else {
                        return true
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
              <HStack>
                <Button
                  onClick={() => dispatch(backToOne(form.getValues()))}
                  leftIcon={<FaArrowLeft />}
                  variant="back"
                >
                  Retour
                </Button>

                <Button
                  variant={'save'}
                  type="submit"
                  leftIcon={<FaSave />}
                  isLoading={loading}
                >
                  Envoyer la demande
                </Button>
              </HStack>
            </VStack>
          </form>
        )}
    </VStack>
  )
}
