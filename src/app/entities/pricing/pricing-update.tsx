import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { createEntity, getEntity, reset, updateEntity } from './pricing.reducer'

export const PricingUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined

  const pricingEntity = useAppSelector(state => state.pricing.entity)
  const loading = useAppSelector(state => state.pricing.loading)
  const updating = useAppSelector(state => state.pricing.updating)
  const updateSuccess = useAppSelector(state => state.pricing.updateSuccess)

  const handleClose = () => {
    navigate('/pricing')
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
      ...pricingEntity,
      ...values
    }

    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity(entity))
    }
  }

  const defaultValues = () =>
    isNew ? {} : {
      ...pricingEntity
    }

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="gestionhebergementApp.pricing.home.createOrEditLabel"
            data-cy="PricingCreateUpdateHeading"
          >
            Créez ou modifiez un tarif
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
                  label="Nom"
                  id="pricing-wording"
                  name="wording"
                  data-cy="wording"
                  type="text"
                  validate={{
                    required: { value: true, message: 'This field is required.' },
                    minLength: {
                      value: 4,
                      message: 'This field is required to be at least 4 characters.'
                    },
                    maxLength: {
                      value: 40,
                      message: 'This field cannot be longer than 40 characters.'
                    }
                  }}
                />
                <ValidatedField
                  label="Prix"
                  id="pricing-price"
                  name="price"
                  data-cy="price"
                  type="text"
                  validate={{
                    required: { value: true, message: 'This field is required.' },
                    min: { value: 0, message: 'This field should be at least 0.' },
                    validate: v => isNumber(v) || 'This field should be a number.'
                  }}
                />
                <ValidatedField
                  label="Commentaire"
                  id="pricing-comment"
                  name="comment"
                  data-cy="comment"
                  type="text"
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
                  to="/pricing"
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

export default PricingUpdate
