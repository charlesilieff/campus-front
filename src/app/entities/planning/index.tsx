import { CheckCircleIcon, EditIcon, TimeIcon, WarningIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Input, Select, Text, VStack } from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import { AUTHORITIES } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import { PlaceNoImage } from 'app/shared/model/place.model'
import { getHttpEntities, getHttpEntity } from 'app/shared/util/httpUtils'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { BsFillExclamationCircleFill, BsList, BsPlusCircle } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import { ReservationsPlanning } from '../../shared/model/reservationsPlanning.model'
import { PlaceModal } from '../place/placeModal'
import { PlaceWithRooms } from './model'
import { Planning } from './planning'

const apiUrlPlacesWithoutImage = '/api/places/noimage'
const apiUrlPlaces = 'api/planning/places'
const apiUrlReservations = 'api/planning/reservations'

export const IndexPlanning = () => {
  const isAdmin = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.ADMIN])
  )
  const [reservations, setReservations] = useState([] as ReservationsPlanning[])
  const [places, setPlaces] = useState([] as PlaceNoImage[])

  const [place, setPlace] = useState(O.none<PlaceWithRooms>())
  const [date, setDate] = useState(dayjs())

  useEffect(() => {
    getPlaces()
  }, [])

  const getPlaces = async () => {
    const requestUrl = `${apiUrlPlacesWithoutImage}`

    const data = await getHttpEntities(requestUrl, PlaceNoImage)

    setPlaces(data)

    getOnePlace(data[0].id)
  }

  const getOnePlace = async (id: number) => {
    const requestUrl = `${apiUrlPlaces}/${id}`

    const data = await getHttpEntity(requestUrl, PlaceWithRooms)

    setPlace(data)

    setReservations([])
    getReservations(id, date)
  }

  const getReservations = async (id: number, startDate: Dayjs) => {
    const requestUrl = `${apiUrlReservations}/${id}/${startDate.format('YYYY-MM-DD')}`
    const data = await getHttpEntities(requestUrl, ReservationsPlanning)
    setReservations(data)
  }

  const newDatePlanning = (dateStart: React.ChangeEvent<HTMLInputElement>) => {
    setDate(dayjs(dateStart.target.value))

    pipe(place, O.map(place => getReservations(place.id, dayjs(dateStart.target.value))))
  }

  // On calcul le nombre de jours du mois de la date passé par l'utilisateur.
  // Si c'est égal à 31 on ne veut pas afficher le deuxiéme mois.
  const totalDays = date.daysInMonth()

  return pipe(
    place,
    O.map(place => (
      <>
        <HStack w={'100%'} justifyContent={'space-between'} alignItems={'flex-end'}>
          <HStack spacing={12}>
            <Box>
              <Input
                type="date"
                onChange={newDatePlanning}
              >
              </Input>
            </Box>
            <HStack>
              <Select
                width={'200px'}
                className="block"
                pl={10}
                py={4}
                onChange={e => {
                  getOnePlace(Number(e.target.value))
                }}
              >
                {places ?
                  (places.map(p => (
                    <option value={p.id} key={p.id}>
                      {p.name}
                    </option>
                  ))) :
                  <option value="" key="0" />}
                Lieu
              </Select>
              <Box py={4}>
                <PlaceModal {...place} />
              </Box>
            </HStack>

            {isAdmin ?
              (
                <HStack spacing={4}>
                  <Box alignSelf={'flex-end'} pb={4}>
                    <Button
                      as={Link}
                      id="new"
                      to="/bookingbeds/new"
                      _hover={{ textDecoration: 'none', color: 'white' }}
                      replace
                      backgroundColor={'green'}
                      color={'white'}
                      leftIcon={<BsPlusCircle />}
                    >
                      Nouvelle réservation
                    </Button>
                  </Box>

                  <Box alignSelf={'flex-end'} py={4}>
                    <Button
                      as={Link}
                      id="new"
                      _hover={{ textDecoration: 'none', color: 'white' }}
                      to="/reservation/to-be-processed"
                      replace
                      backgroundColor={'#E53E3E'}
                      color={'white'}
                      leftIcon={<BsFillExclamationCircleFill />}
                    >
                      Réservations à traiter
                    </Button>
                  </Box>
                  <Box alignSelf={'flex-end'} py={4}>
                    <Button
                      as={Link}
                      id="new"
                      _hover={{ textDecoration: 'none', color: 'white' }}
                      to="/reservation/employee"
                      replace
                      backgroundColor={'#3182CE'}
                      color={'white'}
                      leftIcon={<BsList />}
                    >
                      Réservations des salariés
                    </Button>
                  </Box>
                </HStack>
              ) :
              null}
          </HStack>
          {isAdmin ?
            (
              <VStack
                alignItems={'flex-start'}
                pb={4}
              >
                <Text fontWeight={'bold'} textDecoration={'underline'}>Légende:</Text>
                <HStack>
                  <Button
                    size={'xs'}
                    disabled={true}
                    id="new"
                    _hover={{ textDecoration: 'none', color: 'white' }}
                    data-cy="entityCreatelButton"
                    backgroundColor={'green.200'}
                    color={'green'}
                    leftIcon={<EditIcon />}
                    rightIcon={<CheckCircleIcon />}
                  >
                    xyr
                  </Button>
                  <Text>réservation finalisée</Text>
                </HStack>
                <HStack>
                  <Button
                    size={'xs'}
                    disabled={true}
                    id="new"
                    _hover={{ textDecoration: 'none', color: 'white' }}
                    data-cy="entityCreatelButton"
                    backgroundColor={'#FDEEB5'}
                    color={'#906904'}
                    rightIcon={<TimeIcon />}
                    leftIcon={<EditIcon />}
                  >
                    xyr
                  </Button>
                  <Text>réservation à traiter</Text>
                </HStack>
                <HStack>
                  <Button
                    size={'xs'}
                    disabled={true}
                    id="new"
                    _hover={{ textDecoration: 'none', color: 'white' }}
                    data-cy="entityCreatelButton"
                    backgroundColor={'#FFD7D7'}
                    color={'#971515'}
                    leftIcon={<EditIcon />}
                    rightIcon={<WarningIcon />}
                  >
                    xyr
                  </Button>
                  <Text>réservation urgente à traiter</Text>
                </HStack>
              </VStack>
            ) :
            ('')}
        </HStack>
        <Planning
          place={place}
          date={date}
          totalDays={totalDays}
          reservations={reservations}
          key="0"
        />
      </>
    )),
    O.getOrNull
  )
}
