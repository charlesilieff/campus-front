import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { IReservation } from 'app/shared/model/reservation.model'
import axios from 'axios'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { TextFormat } from 'react-jhipster'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Button, Table } from 'reactstrap'

const apiUrlReservations = 'api/reservations/lunch-only'

export const ReservationLunchOnly = (props: RouteComponentProps<{ url: string }>) => {
  const [reservations, setReservations] = useState([] as IReservation[])
  const [date, setDate] = useState(dayjs())
  const loading = useAppSelector(state => state.reservation.loading)

  useEffect(() => {
    getReservations(date)
  }, [])

  const handleSyncList = () => {
    getReservations(date)
  }

  const getReservations = async (startDate: Dayjs) => {
    const requestUrl = `${apiUrlReservations}/${startDate.format('YYYY-MM-DD')}?cacheBuster=${
      new Date().getTime()
    }`
    const { data } = await axios.get<IReservation[]>(requestUrl)
    setReservations(data)
  }

  const newDate = (dateStart: any) => {
    setDate(dayjs(dateStart.target.value))
    getReservations(dayjs(dateStart.target.value))
  }

  return (
    <div>
      <h2 id="reservation-heading" data-cy="ReservationHeading">
        Réservations pour les personnes qui ne dorment pas au campus.
        <div className="d-flex justify-content-end">
          <Button className="mr-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} /> Rafraichîr la liste
          </Button>
          <Link
            to="/bookingbeds/new"
            className="btn btn-primary jh-create-entity"
            id="jh-create-entity"
            data-cy="entityCreateButton"
          >
            <FontAwesomeIcon icon="plus" />
            &nbsp; Nouvelle réservation
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        <input
          className="inline-block"
          id="date"
          name="date"
          data-cy="date"
          type="date"
          onChange={newDate}
        >
        </input>
        {reservations && reservations.length > 0 ?
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
                  <th>Dort au Campus</th>
                  <th>Date d&apos;arrivée</th>
                  <th>Date de départ</th>
                  <th>Commentaire</th>
                  <th>Tarif</th>
                  <th>Client</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation, i) => (
                  <tr key={`entity-${i}`} data-cy="entityTable">
                    <td>
                      <Button
                        tag={Link}
                        to={`/bookingbeds/${reservation.id}`}
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
                          to={`/bookingbeds/${reservation.id}`}
                          color="info"
                          size="sm"
                          data-cy="entityDetailsButton"
                        >
                          <FontAwesomeIcon icon="eye" />{' '}
                          <span className="d-none d-md-inline">Voir</span>
                        </Button>
                        <Button
                          tag={Link}
                          to={`/bookingbeds/${reservation.id}/edit`}
                          color="primary"
                          size="sm"
                          data-cy="entityEditButton"
                        >
                          <FontAwesomeIcon icon="pencil-alt" />{' '}
                          <span className="d-none d-md-inline">Modifier</span>
                        </Button>
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

export default ReservationLunchOnly
