import { Heading } from '@chakra-ui/react'
import { faEye, faPencilAlt, faPlus, faSync } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Option as O, pipe } from 'effect'
import React, { useEffect } from 'react'
import { TextFormat } from 'react-jhipster'
import { Link } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

import { getIntermittentReservations } from '../../reservation/reservation.reducer'

export const IntermittentReservations = () => {
  const dispatch = useAppDispatch()

  const account = useAppSelector(state => state.authentication.account)
  const customerId = pipe(
    account.customerId,
    O.fromNullable,
    O.map(Number)
  )
  const userId = pipe(
    account.id,
    O.fromNullable,
    O.map(Number)
  )

  const reservationList = useAppSelector(state => state.reservation.entities)
  const loading = useAppSelector(state => state.reservation.loading)

  useEffect(() => {
    if (O.isSome(userId)) dispatch(getIntermittentReservations(userId.value))
  }, [])

  const handleSyncList = () => {
    if (O.isSome(userId)) dispatch(getIntermittentReservations(userId.value))
  }

  return (
    <div>
      <h2 id="reservation-heading" data-cy="ReservationHeading">
        <Heading>Mes réservations</Heading>
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon={faSync} spin={loading} /> Rafraîchir la liste
          </Button>
          <Link
            to="/bookingbeds/new/intermittent"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon={faPlus} />
            &nbsp; Nouvelle réservation
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {reservationList && reservationList.length > 0 ?
          (
            <Table responsive>
              <thead>
                <tr>
                  <th>Régime sans gluten/lactose</th>

                  <th>Repas du soir d&apos;arrivée</th>
                  <th>Repas du soir de départ</th>
                  <th>Repas du midi d&apos;arrivée</th>
                  <th>Repas du midi de départ</th>
                  <th>Date d&apos;arrivée</th>
                  <th>Date de départ</th>
                  <th>Commentaire</th>

                  <th>Lits</th>

                  <th />
                </tr>
              </thead>
              <tbody>
                {reservationList.map((reservation, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>{reservation.specialDietNumber === 1 ? 'Oui' : 'Non'}</td>

                    <td>{reservation.isArrivalDiner ? 'Oui' : 'Non'}</td>
                    <td>{reservation.isDepartureDiner ? 'Oui' : 'Non'}</td>
                    <td>{reservation.isArrivalLunch ? 'Oui' : 'Non'}</td>
                    <td>{reservation.isDepartureLunch ? 'Oui' : 'Non'}</td>
                    <td>
                      {reservation.arrivalDate ?
                        (
                          <TextFormat
                            type="date"
                            value={reservation.arrivalDate}
                            format={APP_LOCAL_DATE_FORMAT}
                          />
                        ) :
                        null}
                    </td>
                    <td>
                      {reservation.departureDate ?
                        (
                          <TextFormat
                            type="date"
                            value={reservation.departureDate}
                            format={APP_LOCAL_DATE_FORMAT}
                          />
                        ) :
                        null}
                    </td>
                    <td>{reservation.comment}</td>

                    <td>
                      {reservation.beds ?
                        reservation.beds.map((val, j) => (
                          <span key={j}>
                            <Link to={`bed/${val.id}`}>{val.number}</Link>
                            {j === reservation.beds.length - 1 ? '' : ', '}
                          </span>
                        )) :
                        null}
                    </td>

                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          tag={Link}
                          to={`/bookingbeds/${reservation.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon={faEye} />{' '}
                          <span className="d-none d-md-inline">Annuler</span>
                        </Button>
                        {O.isSome(customerId) ?
                          (
                            <Button
                              tag={Link}
                              to={`/bookingbeds/intermittent/${reservation.id}`}
                              color="primary"
                              size="sm"
                              data-cy="entityEditButton"
                            >
                              <FontAwesomeIcon icon={faPencilAlt} />{' '}
                              <span className="d-none d-md-inline">Modifier</span>
                            </Button>
                          ) :
                          null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) :
          (!loading && <div className="alert alert-warning">Pas de réservations trouvées.</div>)}
      </div>
    </div>
  )
}
