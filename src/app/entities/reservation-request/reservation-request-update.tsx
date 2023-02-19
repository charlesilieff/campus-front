/* eslint-disable simple-import-sort/imports */
import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import type { IReservationRequest } from 'app/shared/model/reservation-request.model'
import type { IReservation } from 'app/shared/model/reservation.model'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { isNumber } from 'react-jhipster'
import { Link, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { CustomValidatedField } from '../../shared/util/cross-validation-form'
import {
  backToOne,
  createEntity,
  updateEntity
} from './reservation-request.reducer'

export const ReservationUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()

  const isNew = id === undefined

  const customerEntity = useAppSelector(state => state.requestReservation.entity.customer)
  const reservationEntity = useAppSelector(state => state.requestReservation.entity.reservation)
  const loading = useAppSelector(state => state.requestReservation.loading)
  const updateSuccess = useAppSelector(state => state.requestReservation.updateSuccess)
  const today = new Date().setHours(0) as unknown as Date

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
      dispatch(updateEntity({ ReservationRequest: entity, UUID: id }))
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
    mode: 'onBlur',
    defaultValues
  })

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="gestionhebergementApp.reservation.home.createOrEditLabel"
            data-cy="ReservationCreateUpdateHeading"
          >
            Détails de votre réservation
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
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
                        `/reservation-request/${id}`}
                      data-cy="reservationRequest"
                    >
                      ici
                    </Link>
                    &nbsp;pour gérer votre réservation.
                  </p>
                </h4>
              </div>
            ) :
            (
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(saveEntity)}>
                  <CustomValidatedField
                    className="inline-block"
                    label="Nombre de personnes à héberger"
                    id="reservation-personNumber"
                    name="personNumber"
                    type="number"
                    registerOptions={{
                      required: { value: true, message: 'Valeur requise' },
                      min: { value: 1, message: 'Minimum 1' },
                      max: { value: 1000, message: 'Max 1000' },
                      validate: value => isNumber(value) || 'This field should be a number.'
                    }}
                  />
                  <CustomValidatedField
                    className="inline-block"
                    label="Nombre de régimes sans gluten OU sans lactose"
                    id="reservation-specialDietNumber"
                    name="specialDietNumber"
                    type="number"
                    registerOptions={{
                      required: { value: true, message: 'Valeur requise' },
                      min: { value: 0, message: 'Minimum 0' },
                      max: { value: 1000, message: 'Max 1000' },
                      validate: value => isNumber(value) || 'Tapez un nombre'
                    }}
                    validate={(value: string, getValue) => {
                      if (Number(value) > Number(getValue('personNumber'))) {
                        return 'Ne peut pas être supérieur au nombre de personne hébergées.'
                      }
                      return true
                    }}
                  />
                  <CustomValidatedField
                    label="Prévoir le repas de midi, le jour d'arrivée"
                    id="is_arrival_lunch"
                    name="isArrivalLunch"
                    type="checkbox"
                    data-cy="isArrivalLunch"
                  />
                  <CustomValidatedField
                    label="Prévoir le repas du soir, le jour d'arrivée"
                    id="is_arrival_diner"
                    name="isArrivalDiner"
                    data-cy="isArrivalDiner"
                    type="checkbox"
                  />
                  <CustomValidatedField
                    label="Prévoir le repas de midi, le jour du départ"
                    id="is_departure_lunch"
                    name="isDepartureLunch"
                    data-cy="isDepartureLunch"
                    type="checkbox"
                  />
                  <CustomValidatedField
                    label="Prévoir le repas du soir, le jour du départ"
                    id="is_departure_diner"
                    name="isDepartureDiner"
                    data-cy="isDepartureDiner"
                    type="checkbox"
                  />
                  <p></p>
                  <CustomValidatedField
                    label="Veuillez indiquer si vous souhaitez des lits doubles, et autres demandes."
                    id="reservation-comment"
                    name="comment"
                    data-cy="comment"
                    type="textarea"
                    registerOptions={{
                      maxLength: {
                        value: 400,
                        message: 'Le commentaire ne peut pas faire plus de 400 caractéres.'
                      }
                    }}
                  />
                  <CustomValidatedField
                    label="Date d'arrivée"
                    id="reservation-arrivalDate"
                    name="arrivalDate"
                    type="date"
                    registerOptions={{
                      required: { value: true, message: "La date d'arrivée est obligatoire." }
                    }}
                    validate={(value: string) => {
                      if (new Date(value) <= today) {
                        return "Veuillez rentrez une date d'arrivée postérieure à hier."
                      }
                      return true
                    }}
                  />
                  <CustomValidatedField
                    label="Date de départ"
                    id="reservation-departureDate"
                    name="departureDate"
                    type="date"
                    registerOptions={{
                      required: { value: true, message: 'La date de départ est obligatoire.' }
                    }}
                    validate={(value: string, getValue) => {
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                      if (new Date(value) <= new Date(getValue('arrivalDate'))) {
                        return 'Veuillez rentrez une date postérieure à votre arrivée.'
                      }
                      return true
                    }}
                  />
                  <Button
                    onClick={() => dispatch(backToOne(form.getValues()))}
                    id="cancel-save"
                    data-cy="entityCreateCancelButton"
                    color="info"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    &nbsp;
                    <span className="d-none d-md-inline">Retour</span>
                  </Button>
                  &nbsp;
                  <Button
                    color="primary"
                    id="save-entity"
                    data-cy="entityCreateSaveButton"
                    type="submit"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    &nbsp; Envoyer la demande
                  </Button>
                </form>
              </FormProvider>
            )}
        </Col>
      </Row>
    </div>
  )
}
