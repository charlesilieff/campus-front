import { faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntities as getRooms } from 'app/entities/room/room.reducer'
import { IBed } from 'app/shared/model/bed.model'
import React, { useEffect } from 'react'
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Row, UncontrolledTooltip } from 'reactstrap'

import { createEntity, getEntity, reset, updateEntity } from './bed.reducer'

export const BedUpdate = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  const navigate = useNavigate()
  const isNew = id === undefined

  const rooms = useAppSelector(state => state.room.entities)
  const bedEntity = useAppSelector(state => state.bed.entity)
  const loading = useAppSelector(state => state.bed.loading)
  const updating = useAppSelector(state => state.bed.updating)
  const updateSuccess = useAppSelector(state => state.bed.updateSuccess)

  const handleClose = () => {
    navigate('/bed')
  }

  useEffect(() => {
    if (isNew) {
      dispatch(reset())
    } else {
      dispatch(getEntity(id))
    }

    dispatch(getRooms())
  }, [])

  useEffect(() => {
    if (updateSuccess) {
      handleClose()
    }
  }, [updateSuccess])

  const saveEntity = values => {
    const entity: IBed = {
      ...bedEntity,
      ...values,
      // this is very important but  very bad, otherwise the backend will not be able to find the room
      roomId: values.roomId === '' ? undefined : values.roomId,
      room: rooms.find(it => it.id.toString() === values.roomId.toString())
    }

    if (isNew) {
      dispatch(createEntity(entity))
    } else {
      dispatch(updateEntity(entity))
    }
  }

  const defaultValues = () =>
    isNew ? {} : {
      ...bedEntity,
      // @ts-expect-error TODO: fix this
      roomId: bedEntity?.room?.id === '' ? undefined : bedEntity?.room?.id
    }

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2
            id="gestionhebergementApp.bed.home.createOrEditLabel"
            data-cy="BedCreateUpdateHeading"
          >
            Créez ou modifiez un lit
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
                  label="Type"
                  id="bed-kind"
                  name="kind"
                  data-cy="kind"
                  type="text"
                  validate={{
                    required: { value: true, message: 'This field is required.' },
                    minLength: {
                      value: 4,
                      message: 'This field is required to be at least 4 characters.'
                    },
                    maxLength: {
                      value: 20,
                      message: 'This field cannot be longer than 20 characters.'
                    }
                  }}
                />
                <ValidatedField
                  label="Numéro"
                  id="bed-number"
                  name="number"
                  data-cy="number"
                  type="text"
                  validate={{
                    required: { value: true, message: 'This field is required.' }
                  }}
                />
                <UncontrolledTooltip target="numberLabel">
                  Numéro du lit, peut comporter des lettres
                </UncontrolledTooltip>
                <ValidatedField
                  label="Nombre de places"
                  id="bed-numberOfPlaces"
                  name="numberOfPlaces"
                  data-cy="numberOfPlaces"
                  type="text"
                  validate={{
                    required: { value: true, message: 'This field is required.' },
                    min: { value: 0, message: 'This field should be at least 0.' },
                    validate: v => isNumber(v) || 'This field should be a number.'
                  }}
                />
                <ValidatedField
                  id="bed-room"
                  name="roomId"
                  data-cy="room"
                  label="Chambre"
                  type="select"
                >
                  <option value="" key="0" />
                  {rooms ?
                    rooms.map(otherEntity => (
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
                  to="/bed"
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
