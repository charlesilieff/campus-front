import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { TextFormat } from 'react-jhipster'
import { Link, useParams } from 'react-router-dom'
import { Button, Col, Row, UncontrolledTooltip } from 'reactstrap'

import { getEntity } from './reservation.reducer'

export const ReservationDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const reservationEntity = useAppSelector(state => state.reservation.entity)
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="reservationDetailsHeading">Réservation</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">Id</span>
          </dt>
          <dd>{reservationEntity.id}</dd>
          <dt>
            <span id="personNumber">Nombre de personnes à héberger</span>
          </dt>
          <dd>{reservationEntity.personNumber}</dd>
          <dt>
            <span id="paymentMode">Moyen de paiement</span>
          </dt>
          <dd>{reservationEntity.paymentMode}</dd>
          <dt>
            <span id="isPaid">Payé</span>
          </dt>
          <dd>{reservationEntity.isPaid ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="isConfirmed">Confirmé</span>
          </dt>
          <dd>{reservationEntity.isConfirmed ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="specialDietNumber">Nombre de régimes spéciaux</span>
            <UncontrolledTooltip target="specialDietNumber">Régimes spéciaux</UncontrolledTooltip>
          </dt>
          <dd>{reservationEntity.specialDietNumber}</dd>

          <dt>
            <span id="isArrivalDiner">Repas du soir d&apos;arrivée</span>
          </dt>
          <dt>
            <span id="isArrivalDiner">Is Arrival Diner</span>
          </dt>
          <dd>{reservationEntity.isArrivalDiner ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="isDepartureDiner">Is Departure Diner</span>
          </dt>
          <dd>{reservationEntity.isDepartureDiner ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="isArrivalLunch">Is Arrival Lunch</span>
          </dt>
          <dd>{reservationEntity.isArrivalLunch ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="isDepartureLunch">Is Departure Lunch</span>
          </dt>
          <dd>{reservationEntity.isDepartureLunch ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="arrivalDate">Date d&apos;arrivée</span>
          </dt>
          <dd>
            {reservationEntity.arrivalDate ?
              (
                <TextFormat
                  value={reservationEntity.arrivalDate}
                  type="date"
                  format={APP_LOCAL_DATE_FORMAT}
                />
              ) :
              null}
          </dd>
          <dt>
            <span id="departureDate">Date de départ</span>
          </dt>
          <dd>
            {reservationEntity.departureDate ?
              (
                <TextFormat
                  value={reservationEntity.departureDate}
                  type="date"
                  format={APP_LOCAL_DATE_FORMAT}
                />
              ) :
              null}
          </dd>
          <dt>
            <span id="comment">Commentaire</span>
          </dt>
          <dd>{reservationEntity.comment}</dd>
          <dt>Tarif</dt>
          <dd>{reservationEntity.pricing ? reservationEntity.pricing.wording : ''}</dd>
          <dt>Lits</dt>
          <dd>
            {reservationEntity.beds ?
              reservationEntity.beds.map((val, i) => (
                <span key={val.id}>
                  <a>{val.number}</a>
                  {reservationEntity.beds && i === reservationEntity.beds.length - 1 ? '' : ', '}
                </span>
              )) :
              null}
          </dd>
          <dt>Client</dt>
          <dd>{reservationEntity.customer ? reservationEntity.customer.email : ''}</dd>
        </dl>
        <Button tag={Link} to="/reservation" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon={faArrowLeft} /> <span className="d-none d-md-inline">Retour</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/reservation/${reservationEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon={faPencilAlt} />{' '}
          <span className="d-none d-md-inline">Modifier</span>
        </Button>
      </Col>
    </Row>
  )
}
