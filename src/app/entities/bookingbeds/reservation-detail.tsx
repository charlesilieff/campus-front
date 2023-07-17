import { Button, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import { APP_LOCAL_DATE_FORMAT, AUTHORITIES } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { Option as O } from 'effect'
import { pipe } from 'effect'
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
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.ADMIN])
  )
  useEffect(() => {
    if (reservationId) {
      dispatch(getReservation(reservationId))
    }
  }, [])

  const reservationEntity = useAppSelector(state => state.reservation.entity)
  const customerEntity = pipe(reservationEntity, O.flatMap(r => r.customer))
  return (
    <>
      {O.isSome(reservationEntity) ?
        (
          <VStack alignItems={'flex-start'}>
            {isAdmin ?
              (
                <HStack>
                  {O.isSome(reservationEntity.value.id) ?
                    (
                      <ReservationDeleteDialog
                        reservationId={reservationEntity.value.id.value}
                      />
                    ) :
                    null}

                  {O.isSome(reservationEntity.value.id) ?
                    (
                      <Button
                        as={Link}
                        to={`/bookingbeds/${reservationEntity.value.id.value}/edit`}
                        variant="modify"
                        leftIcon={<FaPencilAlt />}
                      >
                        Modifier la réservation
                      </Button>
                    ) :
                    null}
                </HStack>
              ) :
              (
                <Button as={Link} to={`/planning`} variant="see" leftIcon={<FaCalendar />}>
                  Planning
                </Button>
              )}
            <Heading>Client</Heading>

            {O.isSome(customerEntity) ?
              (
                <>
                  <HStack>
                    <Text fontWeight={'bold'}>Prénom:</Text>

                    <Text>{customerEntity.value.firstname}</Text>
                    <Text fontWeight={'bold'}>Nom:</Text>

                    <Text>{customerEntity.value.lastname}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight={'bold'}>Age:</Text>

                    <Text>{O.getOrNull(customerEntity.value.age)}</Text>

                    <Text fontWeight={'bold'}>Téléphone:</Text>

                    <Text>{O.getOrNull(customerEntity.value.phoneNumber)}</Text>

                    <Text fontWeight={'bold'}>Email:</Text>
                    <Text>{customerEntity.value.email}</Text>
                  </HStack>

                  <Text fontWeight={'bold'}>Commentaire:</Text>

                  <Text>{O.getOrNull(customerEntity.value.comment)}</Text>
                </>
              ) :
              null}

            <Heading>Réservation</Heading>

            <Text fontWeight={'bold'}>Nombre de personnes à héberger</Text>

            <Text>{reservationEntity.value.personNumber}</Text>

            <Text fontWeight={'bold'}>Confirmé</Text>

            <Text>{reservationEntity.value.isConfirmed ? 'Oui' : 'Non'}</Text>

            <Text fontWeight={'bold'}>Nombre de régimes spéciaux</Text>

            <Text>{reservationEntity.value.specialDietNumber}</Text>

            <Text fontWeight={'bold'}>Repas du midi, jour d&apos;arrivée</Text>

            <Text>{reservationEntity.value.isArrivalLunch ? 'Oui' : 'Non'}</Text>

            <Text fontWeight={'bold'}>Repas du soir, jour d&apos;arrivée</Text>

            <Text>{reservationEntity.value.isArrivalDinner ? 'Oui' : 'Non'}</Text>

            <Text fontWeight={'bold'}>Repas du midi, jour de départ</Text>

            <Text>{reservationEntity.value.isDepartureLunch ? 'Oui' : 'Non'}</Text>

            <Text fontWeight={'bold'}>Repas du soir, jour de départ</Text>

            <Text>{reservationEntity.value.isDepartureDinner ? 'Oui' : 'Non'}</Text>

            <Text fontWeight={'bold'}>Date d&apos;arrivée</Text>

            <Text>
              {reservationEntity.value.arrivalDate ?
                (
                  <TextFormat
                    value={O.some(reservationEntity.value.arrivalDate)}
                    type="date"
                    format={APP_LOCAL_DATE_FORMAT}
                  />
                ) :
                null}
            </Text>

            <Text fontWeight={'bold'}>Date de départ</Text>

            <Text>
              {reservationEntity.value.departureDate ?
                (
                  <TextFormat
                    value={O.some(reservationEntity.value.departureDate)}
                    type="date"
                    format={APP_LOCAL_DATE_FORMAT}
                  />
                ) :
                null}
            </Text>

            <Text fontWeight={'bold'}>Commentaire</Text>

            <Text>{O.getOrNull(reservationEntity.value.comment)}</Text>

            <Text fontWeight={'bold'}>Lits</Text>
            <Text>
              {reservationEntity.value.beds ?
                reservationEntity.value.beds.map((val, i) => (
                  <span key={val.id}>
                    {val.number}
                    {reservationEntity.value.beds && i === reservationEntity.value.beds.length - 1 ?
                      '' :
                      ', '}
                  </span>
                )) :
                null}
            </Text>
            <Text fontWeight={'bold'}>Client</Text>
            <Text>
              {O.isSome(customerEntity) ? customerEntity.value.email : ''}
            </Text>

            {isAdmin ?
              (
                <HStack>
                  {O.isSome(reservationEntity.value.id) ?
                    (
                      <ReservationDeleteDialog
                        reservationId={reservationEntity.value.id.value}
                      />
                    ) :
                    null}

                  {O.isSome(reservationEntity.value.id) ?
                    (
                      <Button
                        as={Link}
                        to={`/bookingbeds/${reservationEntity.value.id.value}/edit`}
                        variant="modify"
                        leftIcon={<FaPencilAlt />}
                      >
                        Modifier la réservation
                      </Button>
                    ) :
                    null}
                </HStack>
              ) :
              (
                <Button as={Link} to={`/planning`} variant="see" leftIcon={<FaCalendar />}>
                  Planning
                </Button>
              )}
          </VStack>
        ) :
        null}
    </>
  )
}
