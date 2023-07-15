import {
  Heading,
  HStack,
  Select,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import * as A from '@effect/data/ReadonlyArray'
import { PlaceModal } from 'app/entities/place/placeModal'
import type { PlaceWithRooms } from 'app/entities/planning/model'
import type { BedroomKind } from 'app/shared/model/bedroom-kind.model'
import type { FunctionComponent } from 'react'
import React, { useEffect, useState } from 'react'

import type { Place } from '../models/Place'
import type { RoomWithBedsWithStatus } from '../models/Room'
import { filterBedPlace, filterRoomsByBedRoomKind, getOnePlace,
  getPlaceWithFreeBedsAndBookedBeds } from '../utils'
import { Beds } from './beds-checkbox'
import type { DatesAndMeals } from './reservation-update'

interface DatesAndMealsChoicesProps {
  selectBed: (bedId: number) => void
  selectedBeds: ReadonlyArray<number>
  datesAndMeals: O.Option<DatesAndMeals>
  reservationId: O.Option<string>
  personNumber: number
  reservationBeds: ReadonlyArray<number>
}

export const BedsChoices: FunctionComponent<DatesAndMealsChoicesProps> = (
  { datesAndMeals, reservationId, selectBed, selectedBeds, personNumber, reservationBeds }
): JSX.Element => {
  const [rooms, setRooms] = useState<ReadonlyArray<RoomWithBedsWithStatus>>([])
  const [places, setPlaces] = useState([] as readonly Place[])
  const [bedRoomKinds, setBedRoomKinds] = useState([] as BedroomKind[])
  const [loading, setLoading] = useState(false)
  const [placeImage, setPlace] = useState(O.none<PlaceWithRooms>())
  useEffect(() => {
    setLoading(true)
    const getPlaceWithFreeAndBookedBedsAsync = async (
      arrivalDate: Date,
      departureDate: Date,
      reservationId: O.Option<string>
    ) => {
      const placeWithFreeBedsAndBookedBeds = await getPlaceWithFreeBedsAndBookedBeds(false)(
        arrivalDate,
        departureDate,
        reservationId
      )
      const roomsData = placeWithFreeBedsAndBookedBeds.flatMap(place => place.rooms)
      setPlaces(placeWithFreeBedsAndBookedBeds)

      setRooms(roomsData)

      setBedRoomKinds(
        // Permet de n'afficher que les bedroomKind non null et unique
        pipe(
          roomsData,
          A.map(room => room.bedroomKind),
          A.compact,
          A.uniq((bedroomKind1, bedroomKind2) => bedroomKind1.name === bedroomKind2.name)
        )
      )
    }

    if (O.isSome(datesAndMeals)) {
      getPlaceWithFreeAndBookedBedsAsync(
        datesAndMeals.value.arrivalDate,
        datesAndMeals.value.departureDate,
        reservationId
      )
    }
    setLoading(false)
  }, [])

  const placesBooked = places?.reduce((accP, place) => (accP
    + place.rooms?.reduce((accR, room) => (accR
      + room.beds?.reduce(
        (acc, bed) => acc + (selectedBeds?.includes(bed.id) ? bed.numberOfPlaces : 0),
        0
      )), 0)), 0)
  return (
    <VStack alignItems={'flex-start'} my={4}>
      <VStack
        minW={'100%'}
        alignItems={'flex-start'}
        border={'solid'}
        p={4}
        borderRadius={8}
        borderColor={personNumber !== placesBooked ? 'red' : 'green'}
      >
        {loading ?
          <Spinner alignSelf={'center'} /> :
          (
            <VStack spacing={6} alignItems={'flex-start'} width="100%">
              <Heading fontWeight={'bold'} fontSize={'30'}>
                {'Choisissez les lits :'}
              </Heading>
              <HStack justifyContent={'space-around'} width="100%">
                <HStack>
                  <Heading size={'md'} minW={'140px'}>Filtrer par lieu</Heading>
                  <Select
                    minW={'140px'}
                    style={{ padding: '0.4rem', borderRadius: '0.3rem' }}
                    onChange={e => {
                      const placeId = pipe(
                        Number(e.target.value),
                        d => isNaN(d) ? O.none() : O.some(d)
                      )
                      setRooms(filterBedPlace(placeId, places))
                      pipe(
                        placeId,
                        O.map(getOnePlace),
                        O.map(p => p.then(res => setPlace(res)))
                      )
                    }}
                  >
                    <option value={'undefined'}>Aucun</option>

                    {places.map(p => (
                      <option value={p.id} key={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>
                  {O.isSome(placeImage) ? <PlaceModal {...placeImage.value} /> : null}
                </HStack>

                <HStack>
                  <Heading size={'md'}>Filtre par type de chambre</Heading>
                  <Select
                    style={{ padding: '0.4rem', borderRadius: '0.3rem' }}
                    onChange={e =>
                      pipe(
                        e.target.value,
                        O.fromNullable,
                        O.map(d => Number(d)),
                        d => setRooms(filterRoomsByBedRoomKind(d, places))
                      )}
                  >
                    <option
                      value={undefined}
                    >
                      Aucune
                    </option>

                    {pipe(
                      bedRoomKinds,
                      A.map((p, index) => (
                        <option value={p.id} key={index}>
                          {p.name}
                        </option>
                      ))
                    )}
                  </Select>
                </HStack>
              </HStack>
              <Beds
                selectedBeds={selectedBeds}
                rooms={rooms.filter(room => room.beds.length > 0)}
                selectBed={selectBed}
                reservationBeds={reservationBeds}
              />
              <VStack alignItems={'left'}>
                <Text fontWeight={'bold'}>
                  {`Numéros des lit réservés : 
                  ${
                    places
                      .flatMap(place =>
                        place.rooms?.flatMap(room =>
                          room.beds.filter(bed => selectedBeds.includes(bed.id))
                            .map(b => b.number)
                        )
                      ).join(', ')
                  }`}
                </Text>

                <Text style={{ color: personNumber !== placesBooked ? 'red' : 'green' }}>
                  {`Nombre de personnes hébergées : ${placesBooked} / ${personNumber}`}
                </Text>
              </VStack>
            </VStack>
          )}
      </VStack>
    </VStack>
  )
}
