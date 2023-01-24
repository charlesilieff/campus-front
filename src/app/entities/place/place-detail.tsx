import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { byteSize, openFile } from 'react-jhipster'
import { Link, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { getEntity } from './place.reducer'

export const PlaceDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const placeEntity = useAppSelector(state => state.place.entity)
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="placeDetailsHeading">Lieu</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Nom</span>
          </dt>
          <dd>{placeEntity.name}</dd>
          <dt>
            <span id="comment">Commentaire</span>
          </dt>
          <dd>{placeEntity.comment}</dd>
          <dt>
            <span id="image">Image</span>
          </dt>
          <dd>
            {placeEntity.image ?
              (
                <div>
                  {placeEntity.imageContentType ?
                    (
                      <a onClick={openFile(placeEntity.imageContentType, placeEntity.image)}>
                        <img
                          src={`data:${placeEntity.imageContentType};base64,${placeEntity.image}`}
                          style={{ maxHeight: '30px' }}
                        />
                      </a>
                    ) :
                    null}
                  <span>
                    {placeEntity.imageContentType}, {byteSize(placeEntity.image)}
                  </span>
                </div>
              ) :
              null}
          </dd>
        </dl>
        <Button tag={Link} to="/place" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon={faArrowLeft} /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/place/${placeEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon={faPencilAlt} />{' '}
          <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  )
}

export default PlaceDetail
