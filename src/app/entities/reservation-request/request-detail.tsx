import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaPencilAlt } from 'react-icons/fa'
import { TextFormat } from 'react-jhipster'
import { Link, useParams } from 'react-router-dom'

import { ReservationRequestDeleteDialog } from './request-delete-dialog'
import { getEntity } from './reservation-request.reducer'

export const ReservationRequestDetail = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { uuid } = useParams<'uuid'>()

  useEffect(() => {
    dispatch(getEntity(uuid))
  }, [])

  const customerEntity = useAppSelector(state => state.requestReservation.entity.customer)
  const reservationEntity = useAppSelector(state => state.requestReservation.entity.reservation)
  const rooms = reservationEntity?.beds?.map(b => b?.room?.name)
  const uniqueRooms = rooms?.filter((v, i, a) => a.indexOf(v) === i)
  return (
    <VStack>
      <VStack alignItems={'left'}>
        <VStack alignItems={'left'} mb={4}>
          <Heading size="md" my={3}>Vous</Heading>

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

          <dt>
            <span id="phoneNumber">Téléphone</span>
          </dt>
          <dd>{customerEntity?.phoneNumber}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{customerEntity?.email}</dd>
        </VStack>
        <VStack alignItems={'left'} pt={4} borderTop={'solid'} mt={8}>
          <Heading my={3} size={'md'}>Votre réservations</Heading>

          <dt>
            <span id="personNumber">Nombre de personnes à héberger</span>
          </dt>
          <dd>{reservationEntity?.personNumber}</dd>

          <dt>
            <span id="isConfirmed">Réservation confirmée</span>
          </dt>
          <dd>{reservationEntity?.isConfirmed ? 'Oui' : 'Non'}</dd>
          <dt>
            <span id="specialDietNumber">Nombre de régimes spéciaux</span>
          </dt>
          <dd>{reservationEntity?.specialDietNumber}</dd>
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
            {reservationEntity?.arrivalDate ?
              (
                <TextFormat
                  value={reservationEntity?.arrivalDate}
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
            {reservationEntity?.departureDate ?
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
          <dd>{reservationEntity?.comment}</dd>

          <dt>Chambres réservées à votre nom</dt>
          <dd>
            {uniqueRooms === undefined || uniqueRooms?.length === 0 ?
              "Vous n'avez pas encore de chambres attribuées." :
              uniqueRooms.map((val, i) => (
                <span key={val}>
                  <a>{val}</a>
                  {uniqueRooms && i === uniqueRooms.length - 1 ? '' : ', '}
                </span>
              ))}
          </dd>

          <HStack>
            <ReservationRequestDeleteDialog
              reservationRequestId={uuid}
            />

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
    </VStack>
  )
}
