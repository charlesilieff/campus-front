import React, { useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Col, Row, UncontrolledTooltip } from 'reactstrap'
import {} from 'react-jhipster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { getEntity } from './customer.reducer'

export const CustomerDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getEntity(props.match.params.id))
  }, [])

  const customerEntity = useAppSelector(state => state.customer.entity)
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="customerDetailsHeading">Customer</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="firstname">Firstname</span>
            <UncontrolledTooltip target="firstname">Prénom</UncontrolledTooltip>
          </dt>
          <dd>{customerEntity.firstname}</dd>
          <dt>
            <span id="lastname">Lastname</span>
            <UncontrolledTooltip target="lastname">Nom</UncontrolledTooltip>
          </dt>
          <dd>{customerEntity.lastname}</dd>
          <dt>
            <span id="age">Age</span>
          </dt>
          <dd>{customerEntity.age}</dd>
          {
            /* <dt>
            <span id="isFemal">Genre</span>
          </dt>
          <dd>{customerEntity.isFemal ? 'Femme' : 'Homme'}</dd> */
          }
          <dt>
            <span id="phoneNumber">Téléphone</span>
          </dt>
          <dd>{customerEntity.phoneNumber}</dd>
          <dt>
            <span id="email">Email</span>
            <UncontrolledTooltip target="email">
              Champs unique, peut servir pour l&#39;authentification
            </UncontrolledTooltip>
          </dt>
          <dd>{customerEntity.email}</dd>
          <dt>
            <span id="comment">Comment</span>
          </dt>
          <dd>{customerEntity.comment}</dd>
        </dl>
        <Button tag={Link} to="/customer" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/customer/${customerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  )
}

export default CustomerDetail
