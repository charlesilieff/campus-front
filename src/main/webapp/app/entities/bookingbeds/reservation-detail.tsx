import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import React, { useEffect } from 'react';
import { TextFormat } from 'react-jhipster';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { getEntity } from './reservation.reducer';
import { AUTHORITIES } from 'app/config/constants';

export const ReservationDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector(state => hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN]));
  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const reservationEntity = useAppSelector(state => state.bookingBeds.entity);
  const customerEntity = reservationEntity.customer;
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="customerDetailsHeading">Client</h2>
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
          <dt>
            <span id="comment">Commentaire</span>
          </dt>
          <dd>{customerEntity?.comment}</dd>

          <h2 data-cy="reservationDetailsHeading">Réservation</h2>
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
          </dt>
          <dd>{reservationEntity.specialDietNumber}</dd>
          <dt>
            <span id="isLunchOnly">Dort au campus ?</span>
          </dt>
          <dd>{reservationEntity.isLunchOnly ? 'Non' : 'Oui'}</dd>
          <dt></dt>
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
            {reservationEntity.arrivalDate ? (
              <TextFormat value={reservationEntity.arrivalDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="departureDate">Date de départ</span>
          </dt>
          <dd>
            {reservationEntity.departureDate ? (
              <TextFormat value={reservationEntity.departureDate} type="date" format={APP_LOCAL_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="comment">Commentaire</span>
          </dt>
          <dd>{reservationEntity.comment}</dd>
          <dt>Tarif</dt>
          <dd>{reservationEntity.pricing ? reservationEntity.pricing.wording : ''}</dd>

          <dt>Lits</dt>
          <dd>
            {reservationEntity.beds
              ? reservationEntity.beds.map((val, i) => (
                  <span key={val.id}>
                    {val.number}
                    {reservationEntity.beds && i === reservationEntity.beds.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <dt>Client</dt>
          <dd>{reservationEntity.customer ? reservationEntity.customer.email : ''}</dd>
        </dl>
        {isAdmin ? (
          <>
            <Button tag={Link} to={`/bookingbeds/${reservationEntity.id}/delete`} color="danger" data-cy="entityDeleteButton">
              <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Annuler la réservation</span>
            </Button>
            &nbsp;
            <Button tag={Link} to={`/bookingbeds/${reservationEntity.id}/edit`} replace color="primary">
              <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Modifier la réservation</span>
            </Button>
          </>
        ) : (
          <Button tag={Link} to={`/planning`} replace color="primary">
            <FontAwesomeIcon icon="calendar-day" /> <span className="d-none d-md-inline">Planning</span>
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default ReservationDetail;
