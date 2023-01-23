import { Radio, RadioGroup, Text, VStack } from '@chakra-ui/react'
import * as O from '@effect-ts/core/Option'
import { IRoom } from 'app/shared/model/room.model'
import React, { FunctionComponent } from 'react'

interface IProps {
  rooms: IRoom[]
  selectedBedId: (bedId: O.Option<number>) => void
}
export const IntermittentBeds: FunctionComponent<IProps> = (
  { rooms, selectedBedId }
) => {
  return (
    <RadioGroup onChange={e => selectedBedId(O.some(+e))}>
      {rooms.map(room => {
        const bedRoomKind = room.bedroomKind ? `(${room.bedroomKind.name})` : ''

        return (
          <VStack key={room.id} mb={6} alignItems={'flex-start'}>
            <Text fontWeight={'bold'}>
              {`Chambre ${room.name} ${bedRoomKind}`}
            </Text>
            {room.beds.length === 0 ? 'Aucun lits libre à ces dates.' : room.beds.map(bed => {
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
}
