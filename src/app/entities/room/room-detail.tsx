import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import {} from 'react-jhipster'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntity } from './room.reducer'

export const RoomDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const roomEntity = useAppSelector(state => state.room.entity)
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="roomDetailsHeading">Chambre</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Nom / Numéro</span>
          </dt>
          <dd>{roomEntity.name}</dd>
          <dt>
            <span id="comment">Commentaire</span>
          </dt>
          <dd>{roomEntity.comment}</dd>
          <dt>Type de chambre</dt>
          <dd>{roomEntity.bedroomKind ? roomEntity.bedroomKind.name : ''}</dd>
        </dl>
        <Button tag={Link} to="/room" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/room/${roomEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  )
}

export default RoomDetail
