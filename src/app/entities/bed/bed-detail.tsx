import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { getEntity } from './bed.reducer'

export const BedDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const bedEntity = useAppSelector(state => state.bed.entity)
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bedDetailsHeading">Lit</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="kind">Type</span>
          </dt>
          <dd>{bedEntity.kind}</dd>
          <dt>
            <span id="number">Numéro / Nom</span>
          </dt>
          <dd>{bedEntity.number}</dd>
          <dt>
            <span id="numberOfPlaces">Nombre de places</span>
          </dt>
          <dd>{bedEntity.numberOfPlaces}</dd>
          <dt>Chambre</dt>
          <dd>{bedEntity.room ? bedEntity.room.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/bed" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon={faArrowLeft} /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/bed/${bedEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon={faPencilAlt} />{' '}
          <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  )
}
