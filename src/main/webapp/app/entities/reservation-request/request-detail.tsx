import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect } from 'react';
import { TextFormat } from 'react-jhipster';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { getEntity } from './reservation-request.reducer';

export const CustomerDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const customerEntity = useAppSelector(state => state.requestReservation.entity.customer);
  const reservationEntity = useAppSelector(state => state.requestReservation.entity.reservation);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="customerDetailsHeading">Vous</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="firstname">Prénom</span>
          </dt>
          <dd>{customerEntity?.firstname}</dd>
          <dt>
            <span id="lastname">Nom</span>
          </dt>
          <dd>{customerEntity?.lastname}</dd>
          <dt>
            <span id="age">Age</span>
          </dt>
          <dd>{customerEntity?.age}</dd>
          {/* <dt>
            <span id="isFemal">Genre</span>
          </dt>
          <dd>{customerEntity?.isFemal ? 'Femme' : 'Homme'}</dd> */}
          <dt>
            <span id="phoneNumber">Téléphone</span>
          </dt>
          <dd>{customerEntity?.phoneNumber}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{customerEntity?.email}</dd>

          <h2 data-cy="reservationDetailsHeading">Réservations</h2>

          <dt>
            <span id="personNumber">Nombre de personnes à héberger</span>
          </dt>
          <dd>{reservationEntity?.personNumber}</dd>
          <dt>
            <span id="isPaid">Réservation payée</span>
          </dt>
          <dd>{reservationEntity?.isPaid ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="isConfirmed">Réservation confirmée</span>
          </dt>
          <dd>{reservationEntity?.isConfirmed ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="specialDietNumber">Nombre de régimes spéciaux</span>
          </dt>
          <dd>{reservationEntity?.specialDietNumber}</dd>
          <dt>
            <span id="isArrivalLunch">Repas du midi, jour d&apos;arrivée</span>
          </dt>
          <dd>{reservationEntity?.isArrivalLunch ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="isArrivalDiner">Repas du soir, jour d&apos;arrivée</span>
          </dt>
          <dd>{reservationEntity?.isArrivalDiner ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="isDepartureLunch">Repas du midi, jour de départ</span>
          </dt>
          <dd>{reservationEntity?.isDepartureLunch ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="isDepartureDiner">Repas du soir, jour de départ</span>
          </dt>
          <dd>{reservationEntity?.isDepartureDiner ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="arrivalDate">Date d&apos;arrivée</span>
          </dt>
          <dd>
            {reservationEntity?.arrivalDate ? (
              <TextFormat value={reservationEntity?.arrivalDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="departureDate">Date de départ</span>
          </dt>
          <dd>
            {reservationEntity?.departureDate ? (
              <TextFormat value={reservationEntity.departureDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="comment">Commentaire</span>
          </dt>
          <dd>{reservationEntity?.comment}</dd>

          <dt>Chambres réservées à votre nom</dt>
          <dd>
            {reservationEntity?.rooms?.length === 0 || reservationEntity?.rooms === undefined
              ? "Vous n'avez pas encore de chambres attribuées."
              : reservationEntity?.rooms.map((val, i) => (
                  <span key={val}>
                    <a>{val}</a>
                    {reservationEntity.rooms && i === reservationEntity.rooms.length - 1 ? '' : ', '}
                  </span>
                ))}
          </dd>
        </dl>
        <Button
          tag={Link}
          to={`/reservation-request/${props.match.params.id}/delete`}
          replace
          color="info"
          data-cy="entityDetailsBackButton"
        >
          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Annuler la réservation</span>
        </Button>
        &nbsp;
        <Button data-cy="entityEditButton" tag={Link} to={`/reservation-request/${props.match.params.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Modifier la réservation</span>
        </Button>
      </Col>
    </Row>
  );
};

export default CustomerDetail;
