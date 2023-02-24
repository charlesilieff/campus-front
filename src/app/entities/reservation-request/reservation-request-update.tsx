/* eslint-disable simple-import-sort/imports */
import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IReservationRequest } from 'app/shared/model/reservation-request.model'
import type { IReservation } from 'app/shared/model/reservation.model'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaArrowLeft, FaSave } from 'react-icons/fa'
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useParams } from 'react-router-dom'

import {
  backToOne,
  createEntity,
  updateEntity
} from './reservation-request.reducer'

export const ReservationUpdate = () => {
  const dispatch = useAppDispatch()
  const { uuid } = useParams<'uuid'>()

  const isNew = uuid === undefined

  const customerEntity = useAppSelector(state => state.requestReservation.entity.customer)
  const reservationEntity = useAppSelector(state => state.requestReservation.entity.reservation)
  const loading = useAppSelector(state => state.requestReservation.loading)
  const updateSuccess = useAppSelector(state => state.requestReservation.updateSuccess)

  const today = new Date().setHours(0) as unknown as Date

  const [arrivalDate, setArrivalDate] = useState('')

  const [personNumber, setPersonNumber] = useState(0)
  const saveEntity = (values: IReservation): void => {
    const entity: IReservationRequest = {
      reservation: { ...reservationEntity, ...values },

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
          <ValidatedForm onSubmit={saveEntity} defaultValues={defaultValues}>
            <ValidatedField
              className="inline-block"
              label="Nombre de personnes à héberger"
              id="reservation-personNumber"
              name="personNumber"
              onChange={e => setPersonNumber(Number(e.target.value))}
              type="number"
              validate={{
                required: { value: true, message: 'Valeur requise' },
                min: { value: 1, message: 'Minimum 1' },
                max: { value: 1000, message: 'Max 1000' },
                validate: value => isNumber(value) || 'This field should be a number.'
              }}
            />
            <ValidatedField
              className="inline-block"
              label="Nombre de régimes sans gluten OU sans lactose"
              id="reservation-specialDietNumber"
              name="specialDietNumber"
              type="number"
              validate={{
                required: { value: true, message: 'Valeur requise' },
                min: { value: 0, message: 'Minimum 0' },
                max: { value: 1000, message: 'Max 1000' },

                validate(value: number) {
                  if (Number(value) > personNumber) {
                    return 'Ne peut pas être supérieur au nombre de personne hébergées.'
                  }
                  return true
                }
              }}
            />
            <ValidatedField
              label="Prévoir le repas de midi, le jour d'arrivée"
              name="isArrivalLunch"
              type="checkbox"
              check
            />
            <ValidatedField
              label="Prévoir le repas du soir, le jour d'arrivée"
              name="isArrivalDiner"
              type="checkbox"
              check
            />
            <ValidatedField
              label="Prévoir le repas de midi, le jour du départ"
              id="is_departure_lunch"
              name="isDepartureLunch"
              data-cy="isDepartureLunch"
              type="checkbox"
              check
            />
            <ValidatedField
              label="Prévoir le repas du soir, le jour du départ"
              id="is_departure_diner"
              name="isDepartureDiner"
              data-cy="isDepartureDiner"
              type="checkbox"
              check
            />

            <ValidatedField
              label="Veuillez indiquer si vous souhaitez des lits doubles, et autres demandes."
              id="reservation-comment"
              name="comment"
              data-cy="comment"
              type="textarea"
              validate={{
                maxLength: {
                  value: 400,
                  message: 'Le commentaire ne peut pas faire plus de 400 caractères.'
                }
              }}
            />
            <ValidatedField
              label="Date d'arrivée"
              id="reservation-arrivalDate"
              name="arrivalDate"
              type="date"
              onChange={e => setArrivalDate(e.target.value)}
              validate={{
                required: { value: true, message: "La date d'arrivée est obligatoire." },
                validate(value: string) {
                  if (new Date(value) <= today) {
                    return "Veuillez rentrez une date d'arrivée postérieure à hier."
                  }
                  return true
                }
              }}
            />
            <ValidatedField
              label="Date de départ"
              id="reservation-departureDate"
              name="departureDate"
              type="date"
              validate={{
                required: { value: true, message: "La date d'arrivée est obligatoire." },
                validate(value: string) {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  if (new Date(value) <= new Date(arrivalDate)) {
                    return 'Veuillez rentrez une date postérieure à votre arrivée.'
                  }
                  return true
                }
              }}
            />
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
          </ValidatedForm>
        )}
    </VStack>
  )
}
