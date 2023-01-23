import { HStack, Select } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AUTHORITIES } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { IPlace } from 'app/shared/model/place.model'
import axios from 'axios'
import dayjs, { Dayjs } from 'dayjs'
import React, { useEffect, useState } from 'react'
import { ValidatedField } from 'react-jhipster'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'

import { IReservationsPlanning } from '../../shared/model/reservationsPlanning.model'
import PlaceModal from '../place/placeModal'
import Planning from './planning'

const apiUrlPlacesWithoutImage = '/api/places/noimage'
const apiUrlPlaces = 'api/planning/places'
const apiUrlReservations = 'api/planning/reservations'

const Index = () => {
  const isAdmin = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN])
  )
  const [reservations, setReservations] = useState([] as IReservationsPlanning[])
  const [places, setPlaces] = useState([] as IPlace[])
  const [place, setPlace] = useState(null as IPlace)
  const [date, setDate] = useState(dayjs())

  useEffect(() => {
    getPlaces()
  }, [])

  const getPlaces = async () => {
    const requestUrl = `${apiUrlPlacesWithoutImage}`
    const { data } = await axios.get<IPlace[]>(requestUrl)

    setPlaces(data)

    getOnePlace(data[0].id.toString())
  }

  const getOnePlace = async (id: string) => {
    const requestUrl = `${apiUrlPlaces}/${id}`
    const { data } = await axios.get<IPlace>(requestUrl)

    setPlace(data)
    setReservations(null)
    getReservations(id, date)
  }

  const getReservations = async (id: string, startDate: Dayjs) => {
    const requestUrl = `${apiUrlReservations}/${id}/${startDate.format('YYYY-MM-DD')}`
    const { data } = await axios.get<IReservationsPlanning[]>(requestUrl)
    setReservations(data)
  }

  const newDatePlanning = (dateStart: any) => {
    setDate(dayjs(dateStart.target.value))
    getReservations(place.id.toString(), dayjs(dateStart.target.value))
  }

  // On calcul le nombre de jours du mois de la date passé par l'utilisateur.
  // Si c'est égal à 31 on ne veut pas afficher le deuxiéme mois.
  const totalDays = date.daysInMonth()

  return (
    <div>
      <HStack>
        <ValidatedField
          className="inline-block"
          id="date"
          name="date"
          data-cy="date"
          type="date"
          onChange={newDatePlanning}
        >
        </ValidatedField>
        <Select
          width={'200px'}
          className="block"
          id="place"
          name="placeId"
          data-cy="place"
          pl={10}
          onChange={e => {
            getOnePlace(e.target.value)
          }}
        >
          {places ?
            (places.map(p => (
              <option value={p.id} key={p.id}>
                {p.name}
              </option>
            ))) :
            <option value="" key="0" />}
          Lieu
        </Select>
        <PlaceModal {...place} />
        &nbsp;&nbsp;&nbsp;
        {isAdmin ?
          (
            <>
              <Button
                tag={Link}
                id="new"
                data-cy="entityCreatelButton"
                to="/bookingbeds/new"
                replace
                color="success"
              >
                <FontAwesomeIcon icon="plus-circle" />
                &nbsp;
                <span className="d-none d-md-inline">Nouvelle réservation</span>
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                tag={Link}
                id="new"
                data-cy="entityCreatelButton"
                to="/reservation/not-confirmed"
                replace
                color="danger"
              >
                Réservations non confirmées
              </Button>
              &nbsp;&nbsp;&nbsp;
              <Button
                tag={Link}
                id="new"
                data-cy="entityCreatelButton"
                to="/reservation/lunch-only"
                replace
                color="danger"
              >
                Réservations sans lits
              </Button>
            </>
          ) :
          ('')}
      </HStack>
      <Planning place={place} date={date} totalDays={totalDays} reservations={reservations} />
    </div>
  )
}

export default Index
