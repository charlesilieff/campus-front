import { Button, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as T from '@effect/io/Effect'
import * as S from '@effect/schema/Schema'
import { formatErrors } from '@effect/schema/TreeFormatter'
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants'
import { MealsOnlyUserReservation } from 'app/shared/model/mealsReservation.model'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FaPencilAlt, FaPlus, FaSync } from 'react-icons/fa'
import { Link } from 'react-router-dom'

import { CancelReservationModal } from '../bookingbeds/resp-hebergement-for-employee/cancel-modal'
import { TextFormat } from '../bookingbeds/text-format'

const apiEmployeeReservations = 'api/reservations/employee'
const getEmployeeReservations = T.promise(() => axios.get(apiEmployeeReservations))

export const ReservationsListEmployee = () => {
  const [reservationList, setReservations] = useState([] as readonly MealsOnlyUserReservation[])
  const [loading, setLoading] = useState(false)

  const handleSyncList = () => {
    setLoading(true),
      pipe(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        getEmployeeReservations,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        T.flatMap(d => S.decodeEffect(S.array(MealsOnlyUserReservation))(d.data)),
        T.mapError(e => formatErrors(e.errors)),
        T.map(setReservations),
        T.runPromise
      )
    setLoading(false)
  }

  useEffect(() => {
    handleSyncList()
  }, [])

  return (
    <VStack>
      <Heading>Réservations des salariés</Heading>
      <HStack alignSelf={'flex-end'}>
        <Button variant={'see'} onClick={handleSyncList} isLoading={loading} leftIcon={<FaSync />}>
          Rafraîchir la liste
        </Button>
        <Button
          as={Link}
          to="/bookingbeds/new/employee"
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
                <Th px={2} py={1}>Régime spécial ?</Th>

                <Th px={2} py={1}>Date d&apos;arrivée</Th>
                <Th px={2} py={1}>Date de départ</Th>
                <Th px={2} py={1}>Commentaire</Th>
                <Th px={2} py={1}>Commentaire repas</Th>
                <Th px={2} py={1}>Nom et Prénom</Th>
                <Th px={2} py={1}>Email</Th>
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
                  <Td px={2} py={1}>{pipe(reservation.comment, O.getOrNull)}</Td>
                  <Td px={2} py={1}>{pipe(reservation.commentMeals, O.getOrNull)}</Td>

                  <Td px={2} py={1}>
                    {reservation.customer ?
                      (
                        <Link to={`/customer/${reservation.customer.id}`}>
                          {reservation.customer.firstname} {reservation.customer.lastname}
                        </Link>
                      ) :
                      ''}
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
