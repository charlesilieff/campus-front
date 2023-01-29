import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Col, Row, UncontrolledTooltip } from 'reactstrap'

import { getEntity } from './customer.reducer'

export const CustomerDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    dispatch(getEntity(id))
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
          <FontAwesomeIcon icon={faArrowLeft} /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/customer/${customerEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon={faPencilAlt} />{' '}
          <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  )
}

export default CustomerDetail
