import { Button, Heading, HStack, VStack } from '@chakra-ui/react'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
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
    dispatch(getReservationRequest(uuid))
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

          <Heading size={'sm'}>Prénom</Heading>

          <dd>{customerEntity?.firstname}</dd>
          <Heading size={'sm'}>Nom</Heading>

          <dd>{customerEntity?.lastname}</dd>
          <Heading size={'sm'}>Age</Heading>

          <dd>{customerEntity?.age}</dd>

          <Heading size={'sm'}>Téléphone</Heading>

          <dd>{customerEntity?.phoneNumber}</dd>
          <Heading size={'sm'}>Email</Heading>

          <dd>{customerEntity?.email}</dd>
        </VStack>
        <VStack alignItems={'left'} pt={4} borderTop={'solid'} mt={8}>
          <Heading my={3} size={'md'}>Votre réservations</Heading>

          <Heading size={'sm'}>Nombre de personnes à héberger</Heading>

          <dd>{reservationEntity?.personNumber}</dd>

          <Heading size={'sm'}>Réservation confirmée</Heading>

          <dd>{reservationEntity?.isConfirmed ? 'Oui' : 'Non'}</dd>
          <Heading size={'sm'}>Nombre de régimes spéciaux</Heading>

          <dd>{reservationEntity?.specialDietNumber}</dd>
          <Heading size={'sm'}>Repas du midi, jour d&apos;arrivée</Heading>

          <dd>{reservationEntity?.isArrivalLunch ? 'Oui' : 'Non'}</dd>
          <Heading size={'sm'}>Repas du soir, jour d&apos;arrivée</Heading>

          <dd>{reservationEntity?.isArrivalDiner ? 'Oui' : 'Non'}</dd>
          <Heading size={'sm'}>Repas du midi, jour de départ</Heading>

          <dd>{reservationEntity?.isDepartureLunch ? 'Oui' : 'Non'}</dd>
          <Heading size={'sm'}>Repas du soir, jour de départ</Heading>

          <dd>{reservationEntity?.isDepartureDiner ? 'Oui' : 'Non'}</dd>
          <Heading size={'sm'}>Date d&apos;arrivée</Heading>

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
          <Heading size={'sm'}>Date de départ</Heading>

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
          <Heading size={'sm'}>Commentaire</Heading>

          <dd>{reservationEntity?.comment}</dd>

          <Heading size={'sm'}>Chambres réservées à votre nom</Heading>
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
