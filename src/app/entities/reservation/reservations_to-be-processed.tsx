import { Button, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaEye, FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { ReservationDeleteDialog } from '../bookingbeds/reservation-delete-dialog'
import { TextFormat } from '../bookingbeds/text-format'
import { getReservationsToBeProcessed } from './reservation.reducer'

export const ReservationsListToBeProcessed = () => {
  const dispatch = useAppDispatch()

  const reservationList = useAppSelector(state => state.reservation.entities)

  const loading = useAppSelector(state => state.reservation.loading)

  useEffect(() => {
    dispatch(getReservationsToBeProcessed())
  }, [])

  const handleSyncList = () => {
    dispatch(getReservationsToBeProcessed())
  }

  return (
    <VStack>
      <Heading>Réservations à traiter</Heading>
      <HStack alignSelf={'flex-end'}>
        <Button variant={'see'} onClick={handleSyncList} isLoading={loading} leftIcon={<FaSync />}>
          Rafraîchir la liste
        </Button>
        <Button
          as={Link}
          to="/bookingbeds/new"
          color={'white'}
          backgroundColor={'#e95420'}
          _hover={{ textDecoration: 'none', color: 'orange' }}
          leftIcon={<FaPlus />}
        >
          Nouvelle réservation
        </Button>
      </HStack>

      {reservationList && reservationList.length > 0 ?
        (
          <Table size={'sm'}>
            <Thead>
              <Tr>
                <Th px={2} py={1}>Nombre de personnes</Th>

                <Th px={2} py={1}>Confirmé</Th>
                <Th px={2} py={1}>Nombre de régime spéciaux</Th>

                <Th px={2} py={1}>Repas du soir d&apos;arrivée</Th>
                <Th px={2} py={1}>Repas du soir de départ</Th>
                <Th px={2} py={1}>Repas du midi d&apos;arrivée</Th>
                <Th px={2} py={1}>Repas du midi de départ</Th>
                <Th px={2} py={1}>Date d&apos;arrivée</Th>
                <Th px={2} py={1}>Date de départ</Th>
                <Th px={2} py={1}>Commentaire</Th>

                <Th px={2} py={1}>Lits</Th>
                <Th px={2} py={1}>Client</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reservationList.map((reservation, i) => (
                <Tr key={`entity-${i}`}>
                  <Td
                    px={2}
                    py={1}
                    textAlign={'center'}
                  >
                    {reservation.personNumber}
                  </Td>

                  <Td px={2} py={1} textAlign={'center'}>
                    {reservation.isConfirmed ? 'Oui' : 'Non'}
                  </Td>
                  <Td px={2} py={1} textAlign={'center'}>{reservation.specialDietNumber}</Td>

                  <Td px={2} py={1}>{reservation.isArrivalDiner ? 'Oui' : 'Non'}</Td>
                  <Td px={2} py={1}>{reservation.isDepartureDiner ? 'Oui' : 'Non'}</Td>
                  <Td px={2} py={1}>{reservation.isArrivalLunch ? 'Oui' : 'Non'}</Td>
                  <Td px={2} py={1}>{reservation.isDepartureLunch ? 'Oui' : 'Non'}</Td>
                  <Td px={2} py={1}>
                    {reservation.arrivalDate ?
                      (
                        <TextFormat
                          type="date"
                          value={reservation.arrivalDate}
                          format={APP_LOCAL_DATE_FORMAT}
                        />
                      ) :
                      null}
                  </Td>
                  <Td px={2} py={1}>
                    {reservation.departureDate ?
                      (
                        <TextFormat
                          type="date"
                          value={reservation.departureDate}
                          format={APP_LOCAL_DATE_FORMAT}
                        />
                      ) :
                      null}
                  </Td>
                  <Td px={2} py={1}>{reservation.comment}</Td>

                  <Td px={2} py={1}>
                    {reservation.beds ?
                      reservation.beds.map((val, j) => (
                        <span key={j}>
                          <Link to={`/bed/${val.id}`}>{val.number}</Link>
                          {j === reservation.beds.length - 1 ? '' : ', '}
                        </span>
                      )) :
                      null}
                  </Td>
                  <Td px={2} py={1}>
                    {reservation.customer ?
                      (
                        <Link to={`/customer/${reservation.customer.id}`}>
                          {reservation.customer.email}
                        </Link>
                      ) :
                      ''}
                  </Td>
                  <Td px={2} py={1} className="text-right">
                    <HStack spacing={0}>
                      <Button
                        as={Link}
                        to={`/bookingbeds/${reservation.id}`}
                        variant={'see'}
                        size="sm"
                        leftIcon={<FaEye />}
                        borderRightRadius={0}
                      >
                        Voir
                      </Button>
                      <Button
                        as={Link}
                        to={`/bookingbeds/${reservation.id}/edit`}
                        variant={'modify'}
                        size="sm"
                        leftIcon={<FaPencilAlt />}
                        borderRadius={0}
                      >
                        Modifier
                      </Button>
                      <ReservationDeleteDialog
                        reservationId={reservation.id}
                        buttonProps={{ size: 'sm', variant: 'danger', borderLeftRadius: 0 }}
                        backToPlanning={false}
                        handleSyncList={handleSyncList}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) :
        (!loading && <div className="alert alert-warning">Pas de réservations trouvées.</div>)}
    </VStack>
  )
}
