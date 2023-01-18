import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import {} from 'react-jhipster'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'

import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntity } from './pricing.reducer'

export const PricingDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
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
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/pricing/${pricingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  )
}

export default PricingDetail
