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
import { PlaceModal } from 'app/entities/place/placeModal'
import type { IBedroomKind } from 'app/shared/model/bedroom-kind.model'
import type { FunctionComponent } from 'react'
import React, { useEffect, useState } from 'react'

import type { IPlace, IRoomWithBeds } from '../utils'
import { getOnePlace } from '../utils'
import { getPlaceWithFreeBedsAndBookedBeds } from '../utils'
import { IntermittentBeds } from './beds-checkbox'
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
  const [rooms, setRooms] = useState<ReadonlyArray<IRoomWithBeds>>([])
  const [places, setPlaces] = useState([] as readonly IPlace[])
  const [roomKinds, setRoomKinds] = useState([] as IBedroomKind[])
  const [loading, setLoading] = useState(false)
  const [placeImage, setPlace] = useState(O.none<IPlace>())
  useEffect(() => {
    setLoading(true)
    const getPlaceWithFreeAndBookedBedsAsync = async (
      arrivalDate: string,
      departureDate: string,
      reservationId: O.Option<string>
    ) => {
      const data = await getPlaceWithFreeBedsAndBookedBeds(false)(
        arrivalDate,
        departureDate,
        reservationId
      )
      const roomsData = data?.flatMap(place => place.rooms)
      setPlaces(data)
      setRooms(roomsData)

      setRoomKinds(
        roomsData
          .map(room => room?.bedroomKind)
          // Permet de n'afficher que les bedroomKind non null et unique
          .filter((bedroomKind, index, arr) =>
            arr?.findIndex(e => bedroomKind?.name === e?.name) === index
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

  const filterBedPlace = (idPlace: O.Option<number>): void => {
    if (O.isNone(idPlace)) {
      setRooms(
        places?.flatMap(place => place.rooms)
      )
    } else {
      setRooms(
        places
          ?.filter(place => place.id === idPlace.value)
          ?.flatMap(place => place.rooms)
      )
    }
  }

  const filterBedRoomKind = (idRoomKind: O.Option<number>): void => {
    if (O.isNone(idRoomKind)) {
      setRooms(
        places?.flatMap(place => place.rooms)
      )
    } else {
      setRooms(
        places
          ?.flatMap(place => place.rooms)
          .filter(room => room.bedroomKind?.id === idRoomKind.value)
      )
    }
  }
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
            <VStack spacing={10} alignItems={'flex-start'} width="100%">
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
                      filterBedPlace(placeId)
                      pipe(
                        placeId,
                        O.map(getOnePlace),
                        O.map(p => p.then(res => setPlace(O.some(res))))
                      )
                    }}
                  >
                    <option value={'undefined'}>Aucun</option>

                    {places?.map(p => (
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
                      pipe(e.target.value, O.fromNullable, O.map(Number), filterBedRoomKind)}
                  >
                    <option value={null}>Aucune</option>

                    {roomKinds.map((p, index) => (
                      <option value={p?.id} key={index}>
                        {p?.name}
                      </option>
                    ))}
                  </Select>
                </HStack>
              </HStack>
              <IntermittentBeds
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
                      ?.flatMap(place =>
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