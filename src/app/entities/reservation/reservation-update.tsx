import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getBeds } from 'app/entities/bed/bed.reducer'
import { getEntities as getCustomers } from 'app/entities/customer/customer.reducer'
import { getEntities as getPricings } from 'app/entities/pricing/pricing.reducer'
import { mapIdList } from 'app/shared/util/entity-utils'
import React, { useEffect } from 'react'
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { createEntity, getEntity, reset, updateEntity } from './reservation.reducer'

export const ReservationUpdate = () => {
  const dispatch = useAppDispatch()

  const { id } = useParams<'id'>()
  const navigate = useNavigate()

  const isNew = id === undefined

  const pricing = useAppSelector(state => state.pricing.entities)
  const beds = useAppSelector(state => state.bed.entities)
  const customers = useAppSelector(state => state.customer.entities)
  const reservationEntity = useAppSelector(state => state.reservation.entity)
  const loading = useAppSelector(state => state.reservation.loading)
  const updating = useAppSelector(state => state.reservation.updating)
  const updateSuccess = useAppSelector(state => state.reservation.updateSuccess)

  const handleClose = () => {
    navigate('/reservation')
  }

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id))
    }

    dispatch(getPricings())
    dispatch(getBeds())
    dispatch(getCustomers())
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = values => {
    // HCau Vérue: imposer une valeur specialDiet ne pouvant pas dépasser le nombre de visiteurs.
    if (values.specialDietNumber > values.personNumber) {
      values.specialDietNumber = values.personNumber
    }
    const customer = customers.find(it => it.id.toString() === values.customerId.toString())
    const entity = {
      ...reservationEntity,
      ...values,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      beds: mapIdList(values.beds),
      pricing: pricing.find(it => it.id.toString() === values.pricingId.toString()),
      // @ts-expect-error : age is "" if not set
      customer: { ...customer, age: customer.age === '' ? undefined : customer.age }
    }

    if (isNew) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      dispatch(createEntity(entity))
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      dispatch(updateEntity(entity))
    }
  }

  const defaultValues = () =>
    isNew ? {} : {
      ...reservationEntity,
      pricingId: reservationEntity?.pricing?.id,
      beds: reservationEntity?.beds?.map(e => e.id.toString()),
      customerId: reservationEntity?.customer?.id
    }

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="gestionhebergementApp.reservation.home.createOrEditLabel"
            data-cy="ReservationCreateUpdateHeading"
          >
            Créer ou modifier la réservation.
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ?
            <p>Chargement...</p> :
            (
              <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                <ValidatedField
                  label="Nombre de personnes à héberger"
                  id="reservation-personNumber"
                  name="personNumber"
                  data-cy="personNumber"
                  type="number"
                  validate={{
                    required: { value: true, message: 'Valeur requise' },
                    min: { value: 1, message: 'This field should be at least 1.' },
                    max: { value: 1000, message: 'This field cannot be more than 1000.' },
                    validate: v => isNumber(v) || 'This field should be a number.'
                  }}
                />
                <ValidatedField
                  label="Moyen de paiement"
                  id="reservation-paymentMode"
                  name="paymentMode"
                  data-cy="paymentMode"
                  type="text"
                  validate={{
                    minLength: { value: 2, message: 'Minimum 2.' },
                    maxLength: { value: 40, message: 'Maximum 40.' }
                  }}
                />
                <ValidatedField
                  label="Réservation payé ?"
                  id="reservation-isPaid"
                  name="isPaid"
                  data-cy="isPaid"
                  check
                  type="checkbox"
                />
                <ValidatedField
                  label="Réservation confirmé ?"
                  id="reservation-isConfirmed"
                  name="isConfirmed"
                  data-cy="isConfirmed"
                  check
                  type="checkbox"
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
                  label="dort au campus ?"
                  id="reservation-isLunchOnly"
                  name="isLunchOnly"
                  data-cy="isLunchOnly"
                  check
                  type="checkbox"
                />
                <ValidatedField
                  label="Is Arrival Diner"
                  id="reservation-isArrivalDiner"
                  name="isArrivalDiner"
                  data-cy="isArrivalDiner"
                  check
                  type="checkbox"
                />
                <ValidatedField
                  label="Is Departure Diner"
                  id="reservation-isDepartureDiner"
                  name="isDepartureDiner"
                  data-cy="isDepartureDiner"
                  check
                  type="checkbox"
                />
                <ValidatedField
                  label="Is Arrival Lunch"
                  id="reservation-isArrivalLunch"
                  name="isArrivalLunch"
                  data-cy="isArrivalLunch"
                  check
                  type="checkbox"
                />
                <ValidatedField
                  label="Is Departure Lunch"
                  id="reservation-isDepartureLunch"
                  name="isDepartureLunch"
                  data-cy="isDepartureLunch"
                  check
                  type="checkbox"
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
                  name="comment"
                  data-cy="comment"
                  type="textarea"
                  validate={{
                    maxLength: { value: 400, message: 'Max 400' }
                  }}
                />
                <ValidatedField
                  id="reservation-pricing"
                  name="pricingId"
                  data-cy="pricing"
                  label="Tarif"
                  type="select"
                >
                  <option value="" key="0" />
                  {pricing ?
                    pricing.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.wording}
                      </option>
                    )) :
                    null}
                </ValidatedField>
                <ValidatedField
                  label="Lits"
                  id="reservation-bed"
                  data-cy="bed"
                  type="select"
                  multiple
                  name="beds"
                >
                  <option value="" key="0" />
                  {beds ?
                    beds.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.number}
                      </option>
                    )) :
                    null}
                </ValidatedField>
                <ValidatedField
                  id="reservation-customer"
                  name="customerId"
                  data-cy="customer"
                  label="Client"
                  type="select"
                >
                  <option value="" key="0" />
                  {customers ?
                    customers.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.email}
                      </option>
                    )) :
                    null}
                </ValidatedField>
                <Button
                  tag={Link}
                  id="cancel-save"
                  data-cy="entityCreateCancelButton"
                  to="/reservation"
                  replace
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
                  disabled={updating}
                >
                  <FontAwesomeIcon icon={faSave} />
                  &nbsp; Sauvegarder
                </Button>
              </ValidatedForm>
            )}
        </Col>
      </Row>
    </div>
  )
}

export default ReservationUpdate
