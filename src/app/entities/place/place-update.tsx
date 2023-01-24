import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { ValidatedBlobField, ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { createEntity, getEntity, reset, updateEntity } from './place.reducer'

export const PlaceUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined

  const placeEntity = useAppSelector(state => state.place.entity)
  const loading = useAppSelector(state => state.place.loading)
  const updating = useAppSelector(state => state.place.updating)
  const updateSuccess = useAppSelector(state => state.place.updateSuccess)

  const handleClose = () => {
    navigate('/place')
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
      ...placeEntity,
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
      ...placeEntity
    }

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="gestionhebergementApp.place.home.createOrEditLabel"
            data-cy="PlaceCreateUpdateHeading"
          >
            Créez ou modifiez un lieu
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
                  id="place-name"
                  name="name"
                  data-cy="name"
                  type="text"
                  validate={{
                    required: { value: true, message: 'This field is required.' },
                    minLength: {
                      value: 2,
                      message: 'This field is required to be at least 2 characters.'
                    },
                    maxLength: {
                      value: 32,
                      message: 'This field cannot be longer than 32 characters.'
                    }
                  }}
                />
                <ValidatedField
                  label="Commentaire"
                  id="place-comment"
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
                <ValidatedBlobField
                  label="Image"
                  id="place-image"
                  name="image"
                  data-cy="image"
                  isImage
                  accept="image/*"
                />
                <Button
                  tag={Link}
                  id="cancel-save"
                  data-cy="entityCreateCancelButton"
                  to="/place"
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

export default PlaceUpdate
