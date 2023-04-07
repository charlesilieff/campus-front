import { Checkbox, Text, VStack } from '@chakra-ui/react'
import type { FunctionComponent } from 'react'
import React from 'react'

import type { IRoomWithBeds } from '../utils'

interface IProps {
  rooms: ReadonlyArray<IRoomWithBeds>
  selectedBeds: ReadonlyArray<number>
  reservationBeds: ReadonlyArray<number>
  selectBed: (bedId: number) => void
}
export const IntermittentBeds: FunctionComponent<IProps> = (
  { rooms, selectBed, selectedBeds, reservationBeds }
) => (
  <>
    {rooms.map(room => {
      const bedRoomKind = room.bedroomKind ? `(${room.bedroomKind.name})` : ''
      const isRoomFull = room.beds.length === room.beds.filter(b => b.booked).length
      return (
        <VStack key={room.id} mb={6} alignItems={'flex-start'}>
          <Text fontWeight={'bold'} color={isRoomFull ? 'grey' : 'black'}>
            {`Chambre ${room.name} ${bedRoomKind}`}
          </Text>
          {isRoomFull ? <Text color={'grey'}>Chambre complète</Text> : room.beds.map(bed => {
            const bedkind = bed.kind ? `(${bed.kind})` : ''
            const isDisabled = bed.booked
              && !reservationBeds.includes(bed.id)

            return (
              <Checkbox
                key={bed.id}
                isDisabled={isDisabled}
                value={bed.id}
                isChecked={selectedBeds.includes(bed.id)}
                onChange={e => selectBed(+e.target.value)}
              >
                {`${bed.number} ${bedkind}  (places : ${bed.numberOfPlaces}) ${
                  isDisabled ? '(réservé)' : ''
                }`}
              </Checkbox>
            )
          })}
        </VStack>
      )
    })}
  </>
)
