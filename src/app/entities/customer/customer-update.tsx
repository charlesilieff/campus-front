import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { createEntity, getEntity, reset, updateEntity } from './customer.reducer'

export const CustomerUpdate = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined

  const customerEntity = useAppSelector(state => state.customer.entity)
  const loading = useAppSelector(state => state.customer.loading)
  const updating = useAppSelector(state => state.customer.updating)
  const updateSuccess = useAppSelector(state => state.customer.updateSuccess)

  const handleClose = (): void => {
    navigate('/customer')
  }

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id))
    }
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = values => {
    const entity = {
      ...customerEntity,
      ...values,
      // @ts-expect-error : age is a number
      age: customerEntity.age === '' ? 0 : customerEntity.age
    }

    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity(entity))
    }
  }

  const defaultValues = () =>
    isNew ? {} : {
      ...customerEntity
    }

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="gestionhebergementApp.customer.home.createOrEditLabel"
            data-cy="CustomerCreateUpdateHeading"
          >
            {isNew ? 'Créez un client.' : "Modifiez les informations d'un client"}
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
                  label="Prénom"
                  id="customer-firstname"
                  name="firstname"
                  data-cy="firstname"
                  type="text"
                  validate={{
                    required: { value: true, message: 'This field is required.' },
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
                    required: { value: true, message: 'This field is required.' },
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
                  label="Age"
                  id="customer-age"
                  name="age"
                  data-cy="age"
                  type="number"
                  validate={{
                    min: { value: 1, message: 'This field should be at least 1.' },
                    max: { value: 125, message: 'This field cannot be more than 125.' },
                    validate: v => isNumber(v) || 'This field should be a number.'
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
                  type="text"
                  validate={{
                    required: { value: true, message: 'This field is required.' },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresse email invalide.'
                    }
                  }}
                />
                <ValidatedField
                  label="Commentaire"
                  id="customer-comment"
                  name="comment"
                  data-cy="comment"
                  type="textarea"
                  validate={{
                    maxLength: {
                      value: 400,
                      message: 'This field cannot be longer than 400 characters.'
                    }
                  }}
                />
                <Button
                  tag={Link}
                  id="cancel-save"
                  data-cy="entityCreateCancelButton"
                  to="/customer"
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

export default CustomerUpdate
