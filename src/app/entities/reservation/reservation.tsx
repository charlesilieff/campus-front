import { faEye, faPencilAlt, faPlus, faSync, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { TextFormat } from 'react-jhipster'
import { Link } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

import { getEntities } from './reservation.reducer'

export const Reservation = () => {
  const dispatch = useAppDispatch()

  const reservationList = useAppSelector(state => state.reservation.entities)
  const loading = useAppSelector(state => state.reservation.loading)

  useEffect(() => {
    dispatch(getEntities())
  }, [])

  const handleSyncList = () => {
    dispatch(getEntities())
  }

  return (
    <div>
      <h2 id="reservation-heading" data-cy="ReservationHeading">
        Reservations
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon={faSync} spin={loading} /> Rafraîchir la liste
          </Button>
          <Link
            to={`new`}
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon={faPlus} />
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
                  <th>Dort au campus</th>
                  <th>Repas du soir d&apos;arrivée</th>
                  <th>Repas du soir de départ</th>
                  <th>Repas du midi d&apos;arrivée</th>
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
                        to={`${reservation.id}`}
                        color="link"
                        size="sm"
                      >
                        {reservation.id}
                      </Button>
                    </td>
                    <td>{reservation.personNumber}</td>
                    <td>{reservation.paymentMode}</td>
                    <td>{reservation.isPaid ? 'true' : 'false'}</td>
                    <td>{reservation.isConfirmed ? 'true' : 'false'}</td>
                    <td>{reservation.specialDietNumber}</td>
                    <td>{reservation.isLunchOnly ? 'Non' : 'Oui'}</td>
                    <td>{reservation.isArrivalDiner ? 'true' : 'false'}</td>
                    <td>{reservation.isDepartureDiner ? 'true' : 'false'}</td>
                    <td>{reservation.isArrivalLunch ? 'true' : 'false'}</td>
                    <td>{reservation.isDepartureLunch ? 'true' : 'false'}</td>
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
                          to={`${reservation.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon={faEye} />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`${reservation.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon={faPencilAlt} />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`reservation/${reservation.id}/delete`}
                          color="danger"
                          size="sm"
                          data-cy="entityDeleteButton"
                        >
                          <FontAwesomeIcon icon={faTrash} />{' '}
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
