import {
  Heading,
  Select,
  Spinner,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import { PlaceModal } from 'app/entities/place/placeModal'
import type { BedroomKind } from 'app/shared/model/bedroom-kind.model'
import type { FunctionComponent } from 'react'
import React, { useEffect, useState } from 'react'

import type { OneBedReservationDatesAndMealsEncoded } from '../models'
import type { IPlace, IRoomWithBeds } from '../utils'
import { getPlaceWithFreeBedsAndBookedBeds } from '../utils'
import { getOnePlace } from '../utils'
import { IntermittentBeds } from './beds-user'

interface DatesAndMealsChoicesProps {
  setSelectedBedId: (bedId: O.Option<number>) => void
  bedId: O.Option<number>
  datesAndMeals: O.Option<OneBedReservationDatesAndMealsEncoded>
}

export const BedsChoices: FunctionComponent<DatesAndMealsChoicesProps> = (
  { datesAndMeals, setSelectedBedId, bedId }
  // props
): JSX.Element => {
  const [rooms, setRooms] = useState<ReadonlyArray<IRoomWithBeds>>([])
  const [places, setPlaces] = useState([] as readonly IPlace[])
  const [roomKinds, setRoomKinds] = useState([] as BedroomKind[])
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
      const roomsData = data?.flatMap(place => place.rooms).sort((a, b) =>
        // @ts-expect-error TODO: fix this
        a?.name.localeCompare(b?.name) || 0
      )
      setPlaces(data)
      // @ts-expect-error TODO: fix this
      setRooms(roomsData)

      setRoomKinds(
        // @ts-expect-error TODO: fix this
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
        O.none()
      )
    }
    setLoading(false)
  }, [])

  const filterBedPlace = (idPlace: O.Option<number>): void => {
    if (O.isNone(idPlace)) {
      setRooms(
        // @ts-expect-error TODO: fix this
        places?.flatMap(place => place.rooms)
      )
    } else {
      setRooms(
        // @ts-expect-error TODO: fix this
        places
          ?.filter(place => place.id === idPlace.value)
          ?.flatMap(place => place.rooms)
      )
    }
  }

  const filterBedRoomKind = (idRoomKind: O.Option<number>): void => {
    if (O.isNone(idRoomKind)) {
      setRooms(
        // @ts-expect-error TODO: fix this
        places?.flatMap(place => place.rooms)
      )
    } else {
      setRooms(
        // @ts-expect-error TODO: fix this
        places
          ?.flatMap(place => place.rooms)
          // @ts-expect-error TODO: fix this
          .filter(room => room.bedroomKind?.id === idRoomKind.value)
      )
    }
  }

  const placesBooked = places?.reduce((accP, place) => (accP
    // @ts-expect-error TODO: fix this
    + place.rooms?.reduce((accR, room) => (accR
      // @ts-expect-error TODO: fix this
      + room.beds?.reduce(
        // @ts-expect-error TODO: fix this
        (acc, bed) => acc + (O.getOrNull(bedId) === bed.id ? bed.numberOfPlaces : 0),
        0
      )), 0)), 0)

  const personNumberMax = 1

  return (
    <VStack alignItems={'flex-start'} my={4}>
      <VStack
        minW={'100%'}
        alignItems={'flex-start'}
        border={'solid'}
        p={4}
        borderRadius={8}
        borderColor={personNumberMax !== placesBooked ? 'red' : 'green'}
      >
        {loading ?
          <Spinner alignSelf={'center'} /> :
          (
            <VStack spacing={10} alignItems={'flex-start'}>
              <Heading fontWeight={'bold'} fontSize={'30'}>
                {'Choisissez votre lit :'}
              </Heading>
              <Stack
                direction={{ base: 'column', lg: 'row' }}
              >
                <Stack direction={{ base: 'column', md: 'row' }}>
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
                </Stack>

                <Stack direction={{ base: 'column', md: 'row' }}>
                  <Heading size={'md'}>Filtre par type de chambre</Heading>
                  <Select
                    style={{ padding: '0.4rem', borderRadius: '0.3rem' }}
                    onChange={e =>
                      pipe(e.target.value, O.fromNullable, O.map(Number), filterBedRoomKind)}
                  >
                    <option value={undefined}>Aucune</option>

                    {roomKinds.map((p, index) => (
                      <option value={p?.id} key={index}>
                        {p?.name}
                      </option>
                    ))}
                  </Select>
                </Stack>
              </Stack>
              <IntermittentBeds
                bedId={pipe(bedId, O.map(bedId => bedId.toString()))}
                rooms={rooms}
                selectedBedId={setSelectedBedId}
              />
              <VStack alignItems={'left'}>
                <Text fontWeight={'bold'}>
                  {`Numéros des lit réservés : 
                ${
                    places
                      ?.flatMap(place =>
                        place.rooms?.flatMap(room =>
                          // @ts-expect-error TODO: fix this
                          room.beds.filter(bed => bed.id === O.getOrNull(bedId))
                            .map(b => b.number)
                        )
                      ).join(', ')
                  }`}
                </Text>

                <Text style={{ color: personNumberMax !== placesBooked ? 'red' : 'green' }}>
                  {`Nombre de personnes hébergées : ${placesBooked} `}
                </Text>
              </VStack>
            </VStack>
          )}
      </VStack>
    </VStack>
  )
}
