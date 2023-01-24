import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { getEntity } from './bedroom-kind.reducer'

export const BedroomKindDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<'id'>()

  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const bedroomKindEntity = useAppSelector(state => state.bedroomKind.entity)
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bedroomKindDetailsHeading">Type de chambre</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">Nom</span>
          </dt>
          <dd>{bedroomKindEntity.name}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{bedroomKindEntity.description}</dd>
        </dl>
        <Button
          tag={Link}
          to="/bedroom-kind"
          replace
          color="info"
          data-cy="entityDetailsBackButton"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button
          tag={Link}
          to={`/bedroom-kind/${bedroomKindEntity.id}/edit`}
          replace
          color="primary"
        >
          <FontAwesomeIcon icon={faPencilAlt} />{' '}
          <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  )
}

export default BedroomKindDetail
