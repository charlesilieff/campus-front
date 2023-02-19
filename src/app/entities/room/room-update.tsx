import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getBedroomKinds } from 'app/entities/bedroom-kind/bedroom-kind.reducer'
import { getEntities as getPlaces } from 'app/entities/place/place.reducer'
import type { IRoom } from 'app/shared/model/room.model'
import React, { useEffect } from 'react'
import { ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { createEntity, getEntity, reset, updateEntity } from './room.reducer'

export const RoomUpdate = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { id } = useParams<'id'>()
  const isNew = id === undefined
  const places = useAppSelector(state => state.place.entities)
  const bedroomKinds = useAppSelector(state => state.bedroomKind.entities)
  const roomEntity = useAppSelector(state => state.room.entity)
  const loading = useAppSelector(state => state.room.loading)
  const updating = useAppSelector(state => state.room.updating)
  const updateSuccess = useAppSelector(state => state.room.updateSuccess)

  const handleClose = () => {
    navigate('/room')
  }

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id))
    }

    dispatch(getPlaces())
    dispatch(getBedroomKinds())
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = values => {
    const entity: IRoom = {
      ...roomEntity,
      ...values,
      // this is so bad
      placeId: values.placeId === '' ? undefined : values.placeId,
      bedroomKindId: values.bedroomKindId === '' ? undefined : values.bedroomKindId,
      place: places.find(it => it.id.toString() === values.placeId.toString()),
      bedroomKind: bedroomKinds.find(it => it.id.toString() === values.bedroomKindId.toString())
    }

    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity(entity))
    }
  }

  const defaultValues = () =>
    isNew ? {} : {
      ...roomEntity,
      placeId: roomEntity?.place?.id,
      bedroomKindId: roomEntity?.bedroomKind?.id
    }

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="gestionhebergementApp.room.home.createOrEditLabel"
            data-cy="RoomCreateUpdateHeading"
          >
            Créer ou éditer une chambre
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
                  id="room-name"
                  name="name"
                  data-cy="name"
                  type="text"
                  validate={{
                    required: { value: true, message: 'Le nom est obligatoire.' },
                    minLength: {
                      value: 1,
                      message: 'Le nom ne doit pas comporter moins de 1 caractères.'
                    },
                    maxLength: {
                      value: 20,
                      message: 'Le nom ne doit pas comporter plus de 20 caractères.'
                    }
                  }}
                />
                <ValidatedField
                  label="Commentaire"
                  id="room-comment"
                  name="comment"
                  data-cy="comment"
                  type="text"
                  validate={{
                    maxLength: {
                      value: 400,
                      message: 'Le commentaire ne doit pas comporter plus de 400 caractères.'
                    }
                  }}
                />
                <ValidatedField
                  id="room-place"
                  name="placeId"
                  data-cy="place"
                  label="Lieu"
                  type="select"
                >
                  <option value="" key="0" />
                  {places ?
                    places.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    )) :
                    null}
                </ValidatedField>
                <ValidatedField
                  id="room-bedroomKind"
                  name="bedroomKindId"
                  data-cy="bedroomKind"
                  label="Type de chambres"
                  type="select"
                >
                  <option value="" key="0" />
                  {bedroomKinds ?
                    bedroomKinds.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.name}
                      </option>
                    )) :
                    null}
                </ValidatedField>
                <Button
                  tag={Link}
                  id="cancel-save"
                  data-cy="entityCreateCancelButton"
                  to="/room"
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
