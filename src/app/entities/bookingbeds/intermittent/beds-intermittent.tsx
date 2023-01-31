import { Radio, RadioGroup, Text, VStack } from '@chakra-ui/react'
import type { IRoom } from 'app/shared/model/room.model'
import { Option as O } from 'effect'
import type { FunctionComponent } from 'react'
import React from 'react'

interface IProps {
  rooms: ReadonlyArray<IRoom>
  bedId: O.Option<string>
  selectedBedId: (bedId: O.Option<number>) => void
}
export const IntermittentBeds: FunctionComponent<IProps> = (
  { rooms, selectedBedId, bedId }
) => (
  <RadioGroup onChange={e => selectedBedId(O.some(+e))} defaultValue={O.getOrNull(bedId)}>
    {rooms.map(room => {
      const bedRoomKind = room.bedroomKind ? `(${room.bedroomKind.name})` : ''

      return (
        <VStack key={room.id} mb={6} alignItems={'flex-start'}>
          <Text fontWeight={'bold'}>
            {`Chambre ${room.name} ${bedRoomKind}`}
          </Text>
          {room.beds.length === 0 ?
            <Text>Aucun lits libre à ces dates.</Text> :
            room.beds.map(bed => {
              const bedkind = bed.kind ? `(${bed.kind})` : ''
              return (
                <Radio
                  key={bed.id}
                  value={bed.id.toString()}
                >
                  {`${bed.number} ${bedkind}  (places : ${bed.numberOfPlaces})`}
                </Radio>
              )
            })}
        </VStack>
      )
    })}
  </RadioGroup>
)
