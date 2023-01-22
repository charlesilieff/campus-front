import {
  Heading,
  Spinner,
  Text,
  VStack
} from '@chakra-ui/react'
import * as A from '@effect-ts/core/Collections/Immutable/Array'

import * as O from '@effect-ts/core/Option'
import { IRoom } from 'app/shared/model/room.model'
import React, { useEffect, useState } from 'react'

import { IntermittentBeds } from './beds-intermittent'
import { DatesAndMeals } from './reservation-intermittent-update'
import { getPlaceWithFreeBeds } from './utils'

interface DatesAndMealsChoicesProps {
  setSelectedBedId: (bedId: O.Option<number>) => void
  datesAndMeals: O.Option<DatesAndMeals>
}

export const BedsChoices = (
  props: DatesAndMealsChoicesProps
): JSX.Element => {
  // const [loading, setLoading] = useState(false)
  // const [places, setPlaces] = useState<A.Array<IPlace>>([])
  const [rooms, setRooms] = useState<A.Array<IRoom>>([])
  // const [roomKinds, setRoomKinds] = useState<A.Array<IBedroomKind>>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    // getPlaces().then(data => setPlaces(A.toMutable(data)))
    console.log('coucocu')
    setLoading(true)
    if (O.isSome(props.datesAndMeals)) {
      getPlaceWithFreeBeds(
        props.datesAndMeals.value.arrivalDate,
        props.datesAndMeals.value.departureDate
      ).then(data => {
        // setPlaces(A.toMutable(data))
        const roomsData = data?.flatMap(place => {
          return place.rooms
        })
        console.log('coucocu2222')
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
              <Heading fontWeight={'bold'} fontSize={'25'}>
                {'Choisissez le lit :'}
              </Heading>

              <IntermittentBeds
                rooms={A.toMutable(rooms)}
                selectedBedId={props.setSelectedBedId}
              />
            </VStack>
          )}
      </VStack>
    </VStack>
  )
}
