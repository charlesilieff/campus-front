import {
  Heading,
  Spinner,
  VStack
} from '@chakra-ui/react'
import { Option as O, pipe } from 'effect'
import type { FunctionComponent } from 'react'
import React, { useEffect, useState } from 'react'

import type { IRoomWithBeds } from '../utils'
import { getIntermittentPlaceWithFreeAndBookedBeds } from '../utils'
import { IntermittentBeds } from './beds-intermittent'
import type { DatesAndMeals } from './reservation-intermittent-update'

interface DatesAndMealsChoicesProps {
  setSelectedBedId: (bedId: O.Option<number>) => void
  bedId: O.Option<number>
  datesAndMeals: O.Option<DatesAndMeals>
  reservationId: O.Option<string>
}

export const BedsChoices: FunctionComponent<DatesAndMealsChoicesProps> = (
  props
): JSX.Element => {
  const [rooms, setRooms] = useState<ReadonlyArray<IRoomWithBeds>>([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    if (O.isSome(props.datesAndMeals)) {
      getIntermittentPlaceWithFreeAndBookedBeds(
        props.datesAndMeals.value.arrivalDate,
        props.datesAndMeals.value.departureDate,
        props.reservationId
      ).then(data => {
        const roomsData = data?.flatMap(place => place.rooms)

        setLoading(false)

        setRooms(roomsData)
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
