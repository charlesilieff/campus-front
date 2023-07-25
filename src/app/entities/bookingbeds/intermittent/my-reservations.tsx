import {
  Box,
  Button,
  Heading,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from '@chakra-ui/react'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import { Option as O, pipe } from 'effect'
import React, { useEffect } from 'react'
import { FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { getOneBedUserReservationsByUserId } from '../../reservation/reservation.reducer'
import { TextFormat } from '../text-format'
import { CancelReservationModal } from './cancel-modal'

export const MyIntermittentReservations = () => {
  const dispatch = useAppDispatch()

  const account = useAppSelector(state => state.authentication.account)
  const customerId = pipe(
    account,
    O.flatMap(a => a.customerId)
  )
  const userId = pipe(
    account,
    O.flatMap(a => a.id)
  )

  const reservationList = useAppSelector(state => state.reservation.entities)
  const loading = useAppSelector(state => state.reservation.loading)

  useEffect(() => {
    if (O.isSome(userId)) dispatch(getOneBedUserReservationsByUserId(userId.value))
  }, [])

  const handleSyncList = () => {
    if (O.isSome(userId)) dispatch(getOneBedUserReservationsByUserId(userId.value))
  }
  const now = new Date()

  return (
    <VStack>
      <Heading alignSelf={'flex-start'}>Mes réservations</Heading>
      <HStack alignSelf={'flex-end'}>
        <Button
          backgroundColor={'#17a2b8'}
          color={'white'}
          onClick={handleSyncList}
          isLoading={loading}
          leftIcon={<FaSync />}
        >
          Rafraîchir la liste
        </Button>
        <Button
          color={'white'}
          backgroundColor={'#E95420'}
          as={Link}
          to="/bookingbeds/new/intermittent"
          leftIcon={<FaPlus />}
          _hover={{ textDecoration: 'none', color: 'orange' }}
        >
          Nouvelle réservation
        </Button>
      </HStack>
      <Box>
        {reservationList && reservationList.length > 0 ?
          (
            <Table>
              <Thead>
                <Tr>
                  <Th>Régime sans gluten/lactose</Th>

                  <Th>Repas du soir d&apos;arrivée</Th>
                  <Th>Repas du soir de départ</Th>
                  <Th>Repas du midi d&apos;arrivée</Th>
                  <Th>Repas du midi de départ</Th>
                  <Th>Date d&apos;arrivée</Th>
                  <Th>Date de départ</Th>
                  <Th>Commentaire</Th>

                  <Th>Lits</Th>
                </Tr>
              </Thead>
              <Tbody>
                {reservationList.map((reservation, i) => (
                  <Tr key={`entity-${i}`} data-cy="entityTable">
                    <Td>{reservation.specialDietNumber === 1 ? 'Oui' : 'Non'}</Td>

                    <Td>{reservation.isArrivalDinner ? 'Oui' : 'Non'}</Td>
                    <Td>{reservation.isDepartureDinner ? 'Oui' : 'Non'}</Td>
                    <Td>{reservation.isArrivalLunch ? 'Oui' : 'Non'}</Td>
                    <Td>{reservation.isDepartureLunch ? 'Oui' : 'Non'}</Td>
                    <Td>
                      {reservation.arrivalDate ?
                        (
                          <TextFormat
                            type="date"
                            value={O.some(reservation.arrivalDate)}
                            format={APP_LOCAL_DATE_FORMAT}
                          />
                        ) :
                        null}
                    </Td>
                    <Td>
                      {reservation.departureDate ?
                        (
                          <TextFormat
                            type="date"
                            value={O.some(reservation.departureDate)}
                            format={APP_LOCAL_DATE_FORMAT}
                          />
                        ) :
                        null}
                    </Td>
                    <Td>{O.getOrNull(reservation.comment)}</Td>

                    <Td>
                      {reservation.beds ?
                        reservation.beds.map((val, j) => (
                          <span key={j}>
                            <Link to={`bed/${val.id}`}>{val.number}</Link>
                            {j === reservation.beds.length - 1 ? '' : ', '}
                          </span>
                        )) :
                        null}
                    </Td>

                    <Td>
                      <HStack spacing={0}>
                        {O.isSome(reservation.id) && O.isSome(customerId) ?
                          (
                            <>
                              <CancelReservationModal
                                userId={userId}
                                getReservations={getOneBedUserReservationsByUserId}
                                reservationId={reservation.id.value}
                              />

                              <Button
                                isDisabled={reservation.arrivalDate < now}
                                size="sm"
                                as={Link}
                                to={`/bookingbeds/one-bed-user/${O.getOrNull(reservation.id)}`}
                                variant={'modify'}
                                borderLeftRadius={0}
                                leftIcon={<FaPencilAlt />}
                              >
                                Modifier
                              </Button>
                            </>
                          ) :
                          null}
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) :
          (!loading && <div className="alert alert-warning">Pas de réservations trouvées.</div>)}
      </Box>
    </VStack>
  )
}
