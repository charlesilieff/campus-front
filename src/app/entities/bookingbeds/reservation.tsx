import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { TextFormat } from 'react-jhipster'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

import { getEntities } from './booking-beds.reducer'

export const Reservation = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch()

  const reservationList = useAppSelector(state => state.reservation.entities)
  const loading = useAppSelector(state => state.reservation.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  const { match } = props

  return (
    <div>
      <h2 id="reservation-heading" data-cy="ReservationHeading">
        Reservations
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Rafraichîr la liste
          </Button>
          <Link
            to={`${match.url}/new`}
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create new Reservation
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {reservationList && reservationList.length > 0 ?
          (
            <Table responsive>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nombre de personnes</th>
                  <th>Moyen de paiement</th>
                  <th>Payé</th>
                  <th>Confirmé</th>
                  <th>Nombre de régime spéciaux</th>
                  <th>Ne dort pas au campus</th>
                  <th>Repas du soir d&apos;arrivé</th>
                  <th>Repas du soir de départ</th>
                  <th>Repas du midi d&apos;arrivé</th>
                  <th>Repas du midi de départ</th>
                  <th>Date d&apos;arrivée</th>
                  <th>Date de départ</th>
                  <th>Commentaire</th>
                  <th>Tarif</th>
                  <th>Lits</th>
                  <th>Client</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {reservationList.map((reservation, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      <Button
                        tag={Link}
                        to={`${match.url}/${reservation.id}`}
                        color="link"
                        size="sm"
                      >
                        {reservation.id}
                      </Button>
                    </td>
                    <td>{reservation.personNumber}</td>
                    <td>{reservation.paymentMode}</td>
                    <td>{reservation.isPaid ? 'Oui' : 'Non'}</td>
                    <td>{reservation.isConfirmed ? 'Oui' : 'Non'}</td>
                    <td>{reservation.specialDietNumber}</td>
                    <td>{reservation.isLunchOnly ? 'Non' : 'Oui'}</td>
                    <td>{reservation.isArrivalDiner}</td>
                    <td>{reservation.isDepartureDiner}</td>
                    <td>{reservation.isArrivalLunch}</td>
                    <td>{reservation.isDepartureLunch}</td>
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
                      {reservation.pricing ?
                        (
                          <Link to={`pricing/${reservation.pricing.id}`}>
                            {reservation.pricing.wording}
                          </Link>
                        ) :
                        ('Pas de tarif associé.')}
                    </td>
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
                    <td>
                      {reservation.customer ?
                        (
                          <Link to={`customer/${reservation.customer.id}`}>
                            {reservation.customer.email}
                          </Link>
                        ) :
                        ''}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button
                          tag={Link}
                          to={`${match.url}/${reservation.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${match.url}/${reservation.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${match.url}/${reservation.id}/delete`}
                          color="danger"
                          size="sm"
                          data-cy="entityDeleteButton"
                        >
                          <FontAwesomeIcon icon="trash" />{' '}
                          <span className="d-none d-md-inline">Suppimer</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) :
          (!loading && <div className="alert alert-warning">No Reservations found</div>)}
      </div>
    </div>
  )
}

export default Reservation
