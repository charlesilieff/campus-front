import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { ICustomer } from 'app/shared/model/customer.model'
import React, { useEffect } from 'react'
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster'
import { useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { getEntity, reset, setData } from './reservation-request.reducer'

export const CustomerUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()

  const isNew = id === undefined

  const customerEntity = useAppSelector(state => state.requestReservation.entity.customer)
  const loading = useAppSelector(state => state.requestReservation.loading)

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id))
    }
  }, [])

  const saveCustomer = (values: ICustomer) => {
    const entity = {
      customer: {
        ...customerEntity,
        ...values,
        // @ts-expect-error : age is "" if not set
        age: values.age === '' ? undefined : values.age,
        isFemal: true
      }
    }

    dispatch(setData(entity))
  }

  const defaultValues = () => {
    return customerEntity
  }

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="gestionhebergementApp.customer.home.createOrEditLabel"
            data-cy="CustomerCreateUpdateHeading"
          >
            {isNew ? 'Créez' : 'Modifiez'} votre demande de réservation : informations de contact
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ?
            <p>Chargement...</p> :
            (
              <ValidatedForm defaultValues={defaultValues()} onSubmit={e => saveCustomer(e)}>
                <ValidatedField
                  label="Prénom"
                  id="customer-firstname"
                  name="firstname"
                  data-cy="firstname"
                  type="text"
                  validate={{
                    required: { value: true, message: 'Ce champ est obligatoire.' },
                    minLength: {
                      value: 1,
                      message: 'This field is required to be at least 1 characters.'
                    },
                    maxLength: {
                      value: 50,
                      message: 'This field cannot be longer than 50 characters.'
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
                    required: { value: true, message: 'Ce champ est obligatoire.' },
                    minLength: { value: 1, message: 'Minimum 1' },
                    maxLength: { value: 50, message: 'Maximum 50' }
                  }}
                />
                <ValidatedField
                  label="Age"
                  id="customer-age"
                  name="age"
                  data-cy="age"
                  type="number"
                  validate={{
                    min: { value: 1, message: 'Minimum 1' },
                    max: { value: 125, message: 'Maximum 125' },
                    validate: v => isNumber(v) || 'Ce doit être un nombre.'
                  }}
                />
                {
                  /* <ValidatedField label="Genre" id="customer-isFemal" name="isFemal" data-cy="isFemal" type="select">
                <option value="true" key="0">
                  Femme
                </option>
                <option value="false" key="1">
                  Homme
                </option>
              </ValidatedField> */
                }
                <ValidatedField
                  label="Téléphone"
                  id="customer-phoneNumber"
                  name="phoneNumber"
                  data-cy="phoneNumber"
                  type="tel"
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
                    required: { value: true, message: "L'adresse email est obligatoire." },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresse email invalide.'
                    }
                  }}
                />
                &nbsp;
                <Button color="primary" id="save-entity" data-cy="stepTwo" type="submit">
                  <FontAwesomeIcon icon="save" />
                  &nbsp; Suivant
                </Button>
              </ValidatedForm>
            )}
        </Col>
      </Row>
    </div>
  )
}

export default CustomerUpdate
