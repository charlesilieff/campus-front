import {
  Heading,
  Spinner,
  VStack
} from '@chakra-ui/react'
import type { IRoom } from 'app/shared/model/room.model'
import { Option as O, pipe } from 'effect'
import { consNonEmptyReadonlyArray } from 'effect/index/Optic'
import type { FunctionComponent } from 'react'
import React, { useEffect, useState } from 'react'

import { getIntermittentPlaceWithFreeBeds } from '../utils'
import { IntermittentBeds } from './beds-intermittent'
import type { DatesAndMeals } from './reservation-intermittent-update'

consNonEmptyReadonlyArray
interface DatesAndMealsChoicesProps {
  setSelectedBedId: (bedId: O.Option<number>) => void
  bedId: O.Option<number>
  datesAndMeals: O.Option<DatesAndMeals>
  reservationId: O.Option<string>
}

export const BedsChoices: FunctionComponent<DatesAndMealsChoicesProps> = (
  props
): JSX.Element => {
  // const [loading, setLoading] = useState(false)
  // const [places, setPlaces] = useState<ReadonlyArray<IPlace>>([])
  const [rooms, setRooms] = useState<ReadonlyArray<IRoom>>([])
  // const [roomKinds, setRoomKinds] = useState<ReadonlyArray<IBedroomKind>>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    // getPlaces().then(data => setPlaces(A.toMutable(data)))

    setLoading(true)
    if (O.isSome(props.datesAndMeals)) {
      getIntermittentPlaceWithFreeBeds(
        props.datesAndMeals.value.arrivalDate,
        props.datesAndMeals.value.departureDate,
        props.reservationId
      ).then(data => {
        // setPlaces(A.toMutable(data))
        const roomsData = data?.flatMap(place => place.rooms)

        setLoading(false)

        setRooms(roomsData)
        // setRoomKinds(
        //   roomsData
        //     .map(room => {
        //       return room?.bedroomKind
        //     })
        //     // Permet de n'afficher que les bedroomKind non null et unique
        //     .filter((bedroomKind, index, arr) => {
        //       return arr?.findIndex(e => bedroomKind?.name === e?.name) === index
        //     })
        // )
      })
    }
  }, [])

  return (
    <VStack alignItems={'flex-start'} my={4}>
      <VStack
        minW={'100%'}
        alignItems={'flex-start'}
        border={'solid'}
        p={4}
        borderRadius={8}
        borderColor={'#D9D9D9'}
      >
        {
          // TODO: NE PAS OUBLIER DE REFAIRE LE FILTRE PAR LIEU
          /* <HStack>
          <VStack alignItems={'flex-start'}>
            <Heading size={'xs'}>Filtrer par lieu</Heading>
            <Select
              className="block"
              id="place"
              name="placeId"
              data-cy="place"
              style={{ padding: '0.4rem', borderRadius: '0.3rem' }}
              onChange={e => {
                e.target.value === '0' ?
                  setPlace(O.none) :
                  getOnePlace(e.target.value).then(IPlace => setPlace(O.some(IPlace)))
                filterBedPlace(places)(Number(e.target.value))
              }}
            >
              <option value={0}>Aucun</option>
              {places ?
                (places?.map(p => (
                  <option value={p.id} key={p.id}>
                    {p.name}
                  </option>
                ))) :
                <option value="" key="0" />}
            </Select>
            <PlaceModal {...O.toNullable(placeImage)} />
          </VStack>
        </HStack> */
        }
        {loading ?
          <Spinner alignSelf={'center'} /> :
          (
            <VStack spacing={10} alignItems={'flex-start'}>
              <Heading fontWeight={'bold'} fontSize={'30'}>
                {'Choisissez votre lit :'}
              </Heading>

              <IntermittentBeds
                bedId={pipe(props.bedId, O.map(bedId => bedId.toString()))}
                rooms={rooms}
                selectedBedId={props.setSelectedBedId}
              />
            </VStack>
          )}
      </VStack>
    </VStack>
  )
}
