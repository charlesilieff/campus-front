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
import * as T from '@effect/io/Effect'
import type { ParseError } from '@effect/schema/ParseResult'
import * as S from '@effect/schema/Schema'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { MealsOnlyUserReservation } from 'app/shared/model/mealsReservation.model'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaPencilAlt, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { TextFormat } from '../text-format'
import { CancelReservationModal } from './cancel-modal'

const apiEmployeeReservations = 'api/reservations/my/employee'
const getOnlyMealsReservationsByUserId = (
  userId: number
): T.Effect<never, ParseError, readonly MealsOnlyUserReservation[]> =>
  pipe(
    T.promise(() => axios.get(`${apiEmployeeReservations}/${userId}`)),
    T.flatMap(d => S.parseEffect(S.array(MealsOnlyUserReservation))(d.data))
  )

export const MyEmployeeReservations = () => {
  const [reservationList, setReservations] = useState([] as readonly MealsOnlyUserReservation[])
  const [loading, setLoading] = useState(false)

  const account = useAppSelector(state => state.authentication.account)

  const userId = pipe(
    account,
    O.flatMap(account => account.id)
  )

  useEffect(() => {
    handleSyncList()
  }, [])

  const handleSyncList = async () => {
    setLoading(true)
    await pipe(
      userId,
      T.flatMap(
        getOnlyMealsReservationsByUserId
      ),
      T.map(setReservations),
      T.tap(() => T.succeed(setLoading(false))),
      T.runPromise
    )
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
      {reservationList.length > 0 ?
        (
          <Table size={'sm'}>
            <Thead>
              <Tr>
                <Th px={2} py={1}>Régime sans gluten/lactose</Th>

                <Th px={2} py={1}>Date d&apos;arrivée</Th>
                <Th px={2} py={1}>Date de départ</Th>
                <Th px={2} py={1}>Commentaire</Th>
                <Th px={2} py={1}>Commentaire repas</Th>
              </Tr>
            </Thead>
            <Tbody>
              {reservationList.map((reservation, i) => (
                <Tr key={`entity-${i}`}>
                  <Td px={12} py={1} textAlign={'left'}>
                    {reservation.isSpecialDiet ? 'Oui' : 'Non'}
                  </Td>

                  <Td px={2} py={1}>
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
                  <Td px={2} py={1}>
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
                  <Td px={2} py={1}>{pipe(reservation.comment, O.getOrNull)}</Td>
                  <Td px={2} py={1}>{pipe(reservation.commentMeals, O.getOrNull)}</Td>
                  <Td px={2} py={1}>
                    {O.isSome(reservation.reservationId) ?
                      (
                        <HStack spacing={0}>
                          <CancelReservationModal
                            getReservations={handleSyncList}
                            reservationId={reservation.reservationId.value}
                          />

                          <Button
                            as={Link}
                            to={`/bookingbeds/employee/${reservation.reservationId.value}`}
                            variant={'modify'}
                            size="sm"
                            borderLeftRadius={0}
                            leftIcon={<FaPencilAlt />}
                          >
                            Modifier
                          </Button>
                        </HStack>
                      ) :
                      null}
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
