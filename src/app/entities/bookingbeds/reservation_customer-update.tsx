import { Button, Heading, useToast, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getPricings } from 'app/entities/pricing/pricing.reducer'
import type { ICustomer } from 'app/shared/model/customer.model'
import React, { useEffect } from 'react'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'

import type { IBookingBeds } from '../../shared/model/bookingBeds.model'
import { getReservationsWithBedEntity, reset, setData } from './booking-beds.reducer'

export const ReservationCustomerUpdate = () => {
  const dispatch = useAppDispatch()
  const toast = useToast()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined

  const creating = useAppSelector(state => state.bookingBeds.creating)

  const reservationEntity = useAppSelector(state => state.bookingBeds.entity)

  const loading = useAppSelector(state => state.bookingBeds.loading)
  const updateSuccess = useAppSelector(state => state.bookingBeds.updateSuccess)

  const handleClose = () => {
    navigate('/planning')
  }

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

    // HCau Vérue: imposer une valeur specialDiet ne pouvant pas dépasser le nombre de visiteurs.
    if (values.specialDietNumber > values.personNumber) {
      values.specialDietNumber = values.personNumber
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

      customer
    }

    dispatch(setData(reservation))
  }

  const defaultValues = () => ({
    isArrivalDiner: true,
    isDepartureDiner: false,
    isArrivalLunch: true,
    isDepartureLunch: true,
    reservationComment: reservationEntity?.comment,
    customerComment: reservationEntity?.customer?.comment,
    ...reservationEntity,
    ...reservationEntity.customer,
    pricingId: reservationEntity?.pricing?.id
  })

  return (
    <VStack>
      <Heading>
        {`${isNew ? 'Créer' : 'Modifier'} la réservation et le client`}
      </Heading>

      {loading ?
        <p>Chargement...</p> :
        (
          <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
            <Button
              as={Link}
              variant="back"
              to="/planning"
            >
              Annuler
            </Button>
            &nbsp;
            <Button variant={'save'} type="submit" leftIcon={<FaSave />}>
              Suivant
            </Button>
            <ValidatedField
              label="Prénom"
              id="customer-firstname"
              name="firstname"
              data-cy="firstname"
              type="text"
              validate={{
                required: { value: true, message: 'Ce champ est requis.' },
                minLength: {
                  value: 1,
                  message: 'Ce champ est requis et doit avoir au moins 1 caractère.'
                },
                maxLength: {
                  value: 50,
                  message: 'Ce champ ne peut pas dépasser plus de 50 caractères.'
                }
              }}
            />
            <ValidatedField
              label="Nom"
              id="customer-lastname"
              name="lastname"
              data-cy="lastname"
              type="text"
              validate={{
                required: { value: true, message: 'Ce champ est requis.' },
                minLength: {
                  value: 1,
                  message: 'Ce champ est requis et doit avoir au moins 1 caractère.'
                },
                maxLength: {
                  value: 50,
                  message: 'Ce champ ne peut pas dépasser plus de 50 caractères.'
                }
              }}
            />
            <ValidatedField
              label="Age"
              id="customer-age"
              name="age"
              data-cy="age"
              type="number"
              validate={{
                min: { value: 1, message: 'Age minimum: 1 an.' },
                max: { value: 125, message: 'Age maximum: 125 ans.' },
                validate: v => isNumber(v) || 'Ce champ doit contenir un nombre.'
              }}
            />
            <ValidatedField
              label="Téléphone"
              id="customer-phoneNumber"
              name="phoneNumber"
              data-cy="phoneNumber"
              type="text"
              validate={{
                required: { value: true, message: 'Le numéro de téléphone est obligatoire.' },
                minLength: { value: 10, message: 'Minimum 10' },
                maxLength: { value: 16, message: 'Maximum 16' }
              }}
            />
            <ValidatedField
              label="Email"
              id="customer-email"
              name="email"
              data-cy="email"
              type="email"
              validate={{
                required: { value: true, message: 'Ce champ est requis.' },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Adresse email invalide.'
                }
              }}
            />
            <ValidatedField
              label="Remarque sur le client"
              id="customer-comment"
              name="customerComment"
              data-cy="comment"
              type="textarea"
              validate={{
                maxLength: {
                  value: 400,
                  message: 'Ce champ ne doit pas dépasser 400 caractères.'
                }
              }}
            />
            <ValidatedField
              label="Nombre de personnes à héberger"
              id="reservation-personNumber"
              name="personNumber"
              data-cy="personNumber"
              type="number"
              validate={{
                required: { value: true, message: 'Valeur requise' },
                min: { value: 1, message: 'Le nombre doit être au minimum 1.' },
                max: { value: 1000, message: 'Le nombre ne doit pas dépasser 1000.' },
                validate: v => isNumber(v) || 'Ce champ doit contenir un nombre.'
              }}
            />
            <ValidatedField
              label="Nombre de régimes sans gluten OU sans lactose."
              id="reservation-specialDietNumber"
              name="specialDietNumber"
              data-cy="specialDietNumber"
              type="number"
              validate={{
                required: { value: true, message: 'Valeur requise' },
                min: { value: 0, message: 'Minimum 0' },
                max: { value: 1000, message: 'Max 1000' },
                validate: value => isNumber(value) || 'Tapez un nombre'
              }}
            />

            <ValidatedField
              label="Prévoir le repas du midi, d'arrivée"
              id="reservation-isArrivalLunch"
              name="isArrivalLunch"
              data-cy="isArrivalLunch"
              type="checkbox"
              check
            />
            <ValidatedField
              label="Prévoir le repas du soir, d'arrivée"
              id="reservation-isArrivalDiner"
              name="isArrivalDiner"
              data-cy="isArrivalDiner"
              type="checkbox"
              check
            />
            <ValidatedField
              label="Prévoir le repas du midi, du départ"
              id="reservation-isDepartureLunch"
              name="isDepartureLunch"
              data-cy="isDepartureLunch"
              type="checkbox"
              check
            />
            <ValidatedField
              label="Prévoir le repas du soir, du départ"
              id="reservation-isDepartureDiner"
              name="isDepartureDiner"
              data-cy="isDepartureDiner"
              type="checkbox"
              check
            />
            <ValidatedField
              label="Date d'arrivée"
              id="reservation-arrivalDate"
              name="arrivalDate"
              data-cy="arrivalDate"
              type="date"
              validate={{
                required: { value: true, message: 'Valeur requise' }
              }}
            />
            <ValidatedField
              label="Date de départ"
              id="reservation-departureDate"
              name="departureDate"
              data-cy="departureDate"
              type="date"
              validate={{
                required: { value: true, message: 'Valeur requise' }
              }}
            />
            <ValidatedField
              label="Commentaire"
              id="reservation-comment"
              name="reservationComment"
              data-cy="comment"
              type="textarea"
              validate={{
                maxLength: { value: 400, message: 'Max 400' }
              }}
            />

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
            &nbsp;
            <Button
              as={Link}
              variant="back"
              to="/planning"
            >
              Annuler
            </Button>
            &nbsp;
            <Button variant={'save'} type="submit" leftIcon={<FaSave />}>
              Suivant
            </Button>
          </ValidatedForm>
        )}
    </VStack>
  )
}
