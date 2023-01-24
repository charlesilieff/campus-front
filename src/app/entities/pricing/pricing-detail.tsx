import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { getEntity } from './pricing.reducer'

export const PricingDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const pricingEntity = useAppSelector(state => state.pricing.entity)
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="pricingDetailsHeading">Tarifs</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="wording">Nom</span>
          </dt>
          <dd>{pricingEntity.wording}</dd>
          <dt>
            <span id="price">Prix</span>
          </dt>
          <dd>{pricingEntity.price}</dd>
          <dt>
            <span id="comment">Commentaire</span>
          </dt>
          <dd>{pricingEntity.comment}</dd>
        </dl>
        <Button tag={Link} to="/pricing" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon={faArrowLeft} /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/pricing/${pricingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon={faPencilAlt} />{' '}
          <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  )
}

export default PricingDetail
