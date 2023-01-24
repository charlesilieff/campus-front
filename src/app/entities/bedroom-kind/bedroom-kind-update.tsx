import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { createEntity, getEntity, reset, updateEntity } from './bedroom-kind.reducer'

export const BedroomKindUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined

  const bedroomKindEntity = useAppSelector(state => state.bedroomKind.entity)
  const loading = useAppSelector(state => state.bedroomKind.loading)
  const updating = useAppSelector(state => state.bedroomKind.updating)
  const updateSuccess = useAppSelector(state => state.bedroomKind.updateSuccess)

  const handleClose = () => {
    navigate('/bedroom-kind')
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
      ...bedroomKindEntity,
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
      ...bedroomKindEntity
    }

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="gestionhebergementApp.bedroomKind.home.createOrEditLabel"
            data-cy="BedroomKindCreateUpdateHeading"
          >
            Créez ou modifiez un type de chambre
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
                  label="Name"
                  id="bedroom-kind-name"
                  name="name"
                  data-cy="name"
                  type="text"
                  validate={{
                    required: { value: true, message: 'This field is required.' },
                    minLength: {
                      value: 4,
                      message: 'This field is required to be at least 4 characters.'
                    },
                    maxLength: {
                      value: 50,
                      message: 'This field cannot be longer than 20 characters.'
                    }
                  }}
                />
                <ValidatedField
                  label="Description"
                  id="bedroom-kind-description"
                  name="description"
                  data-cy="description"
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
                  to="/bedroom-kind"
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

export default BedroomKindUpdate
