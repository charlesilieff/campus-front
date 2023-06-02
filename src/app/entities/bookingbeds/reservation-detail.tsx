import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import React, { useEffect } from 'react'
import { FaCalendar, FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { getReservation } from '../reservation/reservation.reducer'
import { ReservationDeleteDialog } from './reservation-delete-dialog'
import { TextFormat } from './text-format'

export const ReservationDetail = () => {
  const dispatch = useAppDispatch()
  const { reservationId } = useParams<{ reservationId: string }>()

  const isAdmin = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account.authorities, [AUTHORITIES.ADMIN])
  )
  useEffect(() => {
    // @ts-expect-error TODO: fix this
    dispatch(getReservation(reservationId))
  }, [])

  const reservationEntity = useAppSelector(state => state.reservation.entity)
  const customerEntity = reservationEntity.customer
  return (
    <VStack alignItems={'flex-start'}>
      {isAdmin ?
        (
          <HStack>
            <ReservationDeleteDialog
              // @ts-expect-error TODO: fix this
              reservationId={reservationEntity.id}
            />

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

      <Text fontWeight={'bold'}>Commentaire:</Text>

      <Text>{customerEntity?.comment}</Text>

      <Heading>Réservation</Heading>

      <Text fontWeight={'bold'}>Nombre de personnes à héberger</Text>

      <Text>{reservationEntity.personNumber}</Text>

      <Text fontWeight={'bold'}>Confirmé</Text>

      <Text>{reservationEntity.isConfirmed ? 'Oui' : 'Non'}</Text>

      <Text fontWeight={'bold'}>Nombre de régimes spéciaux</Text>

      <Text>{reservationEntity.specialDietNumber}</Text>

      <Text fontWeight={'bold'}>Repas du midi, jour d&apos;arrivée</Text>

      <Text>{reservationEntity?.isArrivalLunch ? 'Oui' : 'Non'}</Text>

      <Text fontWeight={'bold'}>Repas du soir, jour d&apos;arrivée</Text>

      <Text>{reservationEntity?.isArrivalDiner ? 'Oui' : 'Non'}</Text>

      <Text fontWeight={'bold'}>Repas du midi, jour de départ</Text>

      <Text>{reservationEntity?.isDepartureLunch ? 'Oui' : 'Non'}</Text>

      <Text fontWeight={'bold'}>Repas du soir, jour de départ</Text>

      <Text>{reservationEntity?.isDepartureDiner ? 'Oui' : 'Non'}</Text>

      <Text fontWeight={'bold'}>Date d&apos;arrivée</Text>

      <Text>
        {reservationEntity.arrivalDate ?
          (
            <TextFormat
              value={reservationEntity.arrivalDate}
              type="date"
              format={APP_LOCAL_DATE_FORMAT}
            />
          ) :
          null}
      </Text>

      <Text fontWeight={'bold'}>Date de départ</Text>

      <Text>
        {reservationEntity.departureDate ?
          (
            <TextFormat
              value={reservationEntity.departureDate}
              type="date"
              format={APP_LOCAL_DATE_FORMAT}
            />
          ) :
          null}
      </Text>

      <Text fontWeight={'bold'}>Commentaire</Text>

      <Text>{reservationEntity.comment}</Text>

      <Text fontWeight={'bold'}>Lits</Text>
      <Text>
        {reservationEntity.beds ?
          reservationEntity.beds.map((val, i) => (
            <span key={val.id}>
              {val.number}
              {reservationEntity.beds && i === reservationEntity.beds.length - 1 ? '' : ', '}
            </span>
          )) :
          null}
      </Text>
      <Text fontWeight={'bold'}>Client</Text>
      <Text>{reservationEntity.customer ? reservationEntity.customer.email : ''}</Text>

      {isAdmin ?
        (
          <HStack>
            <ReservationDeleteDialog
              // @ts-expect-error TODO: fix this
              reservationId={reservationEntity.id}
            />

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
