import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Option as O } from 'effect'
import React, { useEffect } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import { TextFormat } from '../bookingbeds/text-format'
import { ReservationRequestDeleteDialog } from './request-delete-dialog'
import { getReservationRequest } from './reservation-request.reducer'

export const ReservationRequestDetail = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { uuid } = useParams<'uuid'>()

  useEffect(() => {
    if (uuid) {
      dispatch(getReservationRequest(uuid))
    }
  }, [])

  const reservationRequestEntity = useAppSelector(state => state.requestReservation.entity)

  return (
    <VStack>
      {O.isSome(reservationRequestEntity) ?
        (
          <VStack alignItems={'left'}>
            <VStack alignItems={'left'} mb={4}>
              <Heading size="md" my={3}>Vous</Heading>

              <Heading size={'sm'}>Prénom</Heading>

              <dd>{reservationRequestEntity.value.customer.firstname}</dd>
              <Heading size={'sm'}>Nom</Heading>

              <dd>{reservationRequestEntity.value.customer.lastname}</dd>
              <Heading size={'sm'}>Age</Heading>

              <dd>{O.getOrNull(reservationRequestEntity.value.customer.age)}</dd>

              <Heading size={'sm'}>Téléphone</Heading>

              <dd>{O.getOrNull(reservationRequestEntity.value.customer.phoneNumber)}</dd>
              <Heading size={'sm'}>Email</Heading>

              <dd>{reservationRequestEntity.value.customer.email}</dd>
            </VStack>
            <VStack alignItems={'left'} pt={4} borderTop={'solid'} mt={8}>
              <Heading my={3} size={'md'}>Votre réservation</Heading>

              <Heading size={'sm'}>Nombre de personnes à héberger</Heading>

              <dd>{reservationRequestEntity.value.reservation.personNumber}</dd>

              <Heading size={'sm'}>Réservation confirmée</Heading>

              <dd>{reservationRequestEntity.value.reservation.isConfirmed ? 'Oui' : 'Non'}</dd>
              <Heading size={'sm'}>Nombre de régimes spéciaux</Heading>

              <dd>{reservationRequestEntity.value.reservation.specialDietNumber}</dd>
              <Heading size={'sm'}>Repas du midi, jour d&apos;arrivée</Heading>

              <dd>{reservationRequestEntity.value.reservation.isArrivalLunch ? 'Oui' : 'Non'}</dd>
              <Heading size={'sm'}>Repas du soir, jour d&apos;arrivée</Heading>

              <dd>{reservationRequestEntity.value.reservation.isArrivalDinner ? 'Oui' : 'Non'}</dd>
              <Heading size={'sm'}>Repas du midi, jour de départ</Heading>

              <dd>{reservationRequestEntity.value.reservation.isDepartureLunch ? 'Oui' : 'Non'}</dd>
              <Heading size={'sm'}>Repas du soir, jour de départ</Heading>

              <dd>
                {reservationRequestEntity.value.reservation.isDepartureDinner ? 'Oui' : 'Non'}
              </dd>
              <Heading size={'sm'}>Date d&apos;arrivée</Heading>

              <dd>
                {reservationRequestEntity.value.reservation.arrivalDate ?
                  (
                    <TextFormat
                      value={O.some(reservationRequestEntity.value.reservation.arrivalDate)}
                      type="date"
                      format={APP_LOCAL_DATE_FORMAT}
                    />
                  ) :
                  null}
              </dd>
              <Heading size={'sm'}>Date de départ</Heading>

              <dd>
                {reservationRequestEntity.value.reservation.departureDate ?
                  (
                    <TextFormat
                      value={O.some(reservationRequestEntity.value.reservation.departureDate)}
                      type="date"
                      format={APP_LOCAL_DATE_FORMAT}
                    />
                  ) :
                  null}
              </dd>
              <Heading size={'sm'}>Commentaire</Heading>

              <dd>{O.getOrNull(reservationRequestEntity.value.reservation.comment)}</dd>

              <Heading size={'sm'}>Commentaire des repas</Heading>

              <dd>{O.getOrNull(reservationRequestEntity.value.reservation.commentMeals)}</dd>

              <Heading size={'sm'}>Chambres réservées à votre nom</Heading>
              <dd>
                {reservationRequestEntity.value.reservation.beds.length === 0 ?
                  "Vous n'avez pas encore de chambres attribuées." :
                  reservationRequestEntity.value.reservation.beds.map((bed, i) => (
                    <span key={bed.id}>
                      <a>{bed.number}</a>
                      {reservationRequestEntity.value.reservation.beds
                          && i === reservationRequestEntity.value.reservation.beds.length - 1 ?
                        '' :
                        ', '}
                    </span>
                  ))}
              </dd>

              <HStack>
                {uuid !== undefined ?
                  (
                    <ReservationRequestDeleteDialog
                      reservationRequestId={uuid}
                    />
                  ) :
                  null}

                <Button
                  as={Link}
                  to={`/reservation-request/${uuid}/edit`}
                  variant="modify"
                  leftIcon={<FaPencilAlt />}
                >
                  Modifier la réservation
                </Button>
              </HStack>
            </VStack>
          </VStack>
        ) :
        null}
    </VStack>
  )
}
