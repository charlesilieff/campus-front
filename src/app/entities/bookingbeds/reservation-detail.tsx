import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import React, { useEffect } from 'react'
import { FaCalendar, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getEntity } from '../reservation/reservation.reducer'
import { ReservationDeleteDialog } from './reservation-delete-dialog'
import { TextFormat } from './text-format'

export const ReservationDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()

  const isAdmin = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN])
  )
  useEffect(() => {
    dispatch(getEntity(id))
  }, [])

  const reservationEntity = useAppSelector(state => state.reservation.entity)
  const customerEntity = reservationEntity.customer
  return (
    <VStack alignItems={'flex-start'}>
      {isAdmin ?
        (
          <HStack>
            <ReservationDeleteDialog reservationId={reservationEntity.id} />

            <Button
              as={Link}
              to={`/bookingbeds/${reservationEntity.id}/edit`}
              variant="modify"
              leftIcon={<FaPencilAlt />}
            >
              Modifier la réservation
            </Button>
          </HStack>
        ) :
        (
          <Button as={Link} to={`/planning`} variant="see" leftIcon={<FaCalendar />}>
            Planning
          </Button>
        )}
      <Heading>Client</Heading>

      <HStack>
        <Text fontWeight={'bold'}>Prénom:</Text>

        <Text>{customerEntity?.firstname}</Text>
        <Text fontWeight={'bold'}>Nom:</Text>

        <Text>{customerEntity?.lastname}</Text>
      </HStack>
      <HStack>
        <Text fontWeight={'bold'}>Age:</Text>

        <Text>{customerEntity?.age}</Text>

        <Text fontWeight={'bold'}>Téléphone:</Text>

        <Text>{customerEntity?.phoneNumber}</Text>

        <Text fontWeight={'bold'}>Email:</Text>
        <Text>{customerEntity?.email}</Text>
      </HStack>

      <dt>
        <span id="comment">Commentaire:</span>
      </dt>
      <dd>{customerEntity?.comment}</dd>

      <Heading>Réservation</Heading>
      <dt>
        <span id="personNumber">Nombre de personnes à héberger</span>
      </dt>
      <dd>{reservationEntity.personNumber}</dd>

      <dt>
        <span id="isConfirmed">Confirmé</span>
      </dt>
      <dd>{reservationEntity.isConfirmed ? 'Oui' : 'Non'}</dd>
      <dt>
        <span id="specialDietNumber">Nombre de régimes spéciaux</span>
      </dt>
      <dd>{reservationEntity.specialDietNumber}</dd>

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

      <dt>Lits</dt>
      <dd>
        {reservationEntity.beds ?
          reservationEntity.beds.map((val, i) => (
            <span key={val.id}>
              {val.number}
              {reservationEntity.beds && i === reservationEntity.beds.length - 1 ? '' : ', '}
            </span>
          )) :
          null}
      </dd>
      <dt>Client</dt>
      <dd>{reservationEntity.customer ? reservationEntity.customer.email : ''}</dd>

      {isAdmin ?
        (
          <HStack>
            <ReservationDeleteDialog reservationId={reservationEntity.id} />

            <Button
              as={Link}
              to={`/bookingbeds/${reservationEntity.id}/edit`}
              variant="modify"
              leftIcon={<FaPencilAlt />}
            >
              Modifier la réservation
            </Button>
          </HStack>
        ) :
        (
          <Button as={Link} to={`/planning`} variant="see" leftIcon={<FaCalendar />}>
            Planning
          </Button>
        )}
    </VStack>
  )
}
