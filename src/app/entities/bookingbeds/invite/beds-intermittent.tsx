import { Radio, RadioGroup, Text, VStack } from '@chakra-ui/react'
import * as O from '@effect/data/Option'
import type { FunctionComponent } from 'react'
import React from 'react'

import type { IRoomWithBeds } from '../utils'

interface IProps {
  rooms: ReadonlyArray<IRoomWithBeds>
  bedId: O.Option<string>
  selectedBedId: (bedId: O.Option<number>) => void
}
export const IntermittentBeds: FunctionComponent<IProps> = (
  { rooms, selectedBedId, bedId }
) => (
  <RadioGroup onChange={e => selectedBedId(O.some(+e))} defaultValue={O.getOrNull(bedId)}>
    <Radio
      // key={bed.id}
      // value={bed.id.toString()}
      // isDisabled={isDisabled}
      // isChecked={O.exists<string>(b => b === '10')(bedId)}
    >
      Pas de chambre
    </Radio>
    {rooms.map(room => {
      const bedRoomKind = room.bedroomKind ? `(${room.bedroomKind.name})` : ''
      const isRoomFull = room.beds.length === room.beds.filter(b => b.booked).length
      return (
        <VStack key={room.id} mb={6} alignItems={'flex-start'}>
          <Text fontWeight={'bold'} color={isRoomFull ? 'grey' : 'black'}>
            {`Chambre ${room.name} ${bedRoomKind}`}
          </Text>

          {room.beds.map(bed => {
            const bedkind = bed.kind ? `(${bed.kind})` : ''
            const isDisabled = bed.booked
              && (!O.exists<string>(b => b === bed.id.toString())(bedId))

            return (
              <Radio
                key={bed.id}
                value={bed.id.toString()}
                isDisabled={isDisabled}
                isChecked={O.exists<string>(b => b === bed.id.toString())(bedId)}
              >
                {`${bed.number} ${bedkind}  (places : ${bed.numberOfPlaces}) ${
                  isDisabled ? '(réservé)' : ''
                }`}
              </Radio>
            )
          })}
        </VStack>
      )
    })}
  </RadioGroup>
)
