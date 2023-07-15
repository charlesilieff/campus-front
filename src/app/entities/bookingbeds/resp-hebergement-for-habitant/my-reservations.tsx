import {
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
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppDispatch, useAppSelector } from 'app/config/store'
import React, { useEffect } from 'react'
import { FaPencilAlt, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { getOneBedUserReservationsByUserId } from '../../reservation/reservation.reducer'
import { TextFormat } from '../text-format'
import { CancelReservationModal } from './cancel-modal'

export const MyHabitantReservations = () => {
  const dispatch = useAppDispatch()

  const account = useAppSelector(state => state.authentication.account)

  const userId = pipe(
    account,
    O.flatMap(account => account.id)
  )

  const reservationList = useAppSelector(state => state.reservation.entities)
  const loading = useAppSelector(state => state.reservation.loading)

  useEffect(() => {
    if (O.isSome(userId)) dispatch(getOneBedUserReservationsByUserId(userId.value))
  }, [])

  const handleSyncList = () => {
    if (O.isSome(userId)) dispatch(getOneBedUserReservationsByUserId(userId.value))
  }

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
      </HStack>

      {reservationList && reservationList.length > 0 ?
        (
          <Table>
            <Thead>
              <Tr>
                <Th>Régime sans gluten/lactose</Th>

                <Th>Date d&apos;arrivée</Th>
                <Th>Date de départ</Th>
                <Th>Commentaire</Th>
                <Th px={2} py={1}>Commentaire repas</Th>
                <Th>Lits</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reservationList.map((reservation, i) => (
                <Tr key={`entity-${i}`} data-cy="entityTable">
                  <Td>{reservation.specialDietNumber === 1 ? 'Oui' : 'Non'}</Td>

                  <Td>
                    <TextFormat
                      type="date"
                      value={O.some(reservation.arrivalDate)}
                      format={APP_LOCAL_DATE_FORMAT}
                    />
                  </Td>
                  <Td>
                    <TextFormat
                      type="date"
                      value={O.some(reservation.departureDate)}
                      format={APP_LOCAL_DATE_FORMAT}
                    />
                  </Td>
                  <Td>{O.getOrNull(reservation.comment)}</Td>
                  <Td>{O.getOrNull(reservation.commentMeals)}</Td>
                  <Td>
                    {reservation.beds.map((val, j) => (
                      <span key={j}>
                        <Link to={`bed/${val.id}`}>{val.number}</Link>
                        {j === reservation.beds.length - 1 ? '' : ', '}
                      </span>
                    ))}
                  </Td>

                  <Td>
                    <HStack spacing={0}>
                      {O.isSome(reservation.id) ?
                        (
                          <>
                            <CancelReservationModal
                              userId={userId}
                              getReservations={getOneBedUserReservationsByUserId}
                              reservationId={reservation.id.value}
                            />

                            <Button
                              size="sm"
                              as={Link}
                              to={`/bookingbeds/one-bed-user/${reservation.id.value}`}
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
    </VStack>
  )
}
