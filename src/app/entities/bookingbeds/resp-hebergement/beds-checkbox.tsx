import { Checkbox, Stack, Text } from '@chakra-ui/react'
import { Option as O } from 'effect'
import { ReadonlyArray as A } from 'effect'
import { pipe } from 'effect'
import type { FunctionComponent } from 'react'
import React from 'react'

import type { RoomWithBedsWithStatus } from '../models/Room'

interface IProps {
  rooms: ReadonlyArray<RoomWithBedsWithStatus>
  selectedBeds: ReadonlyArray<number>
  reservationBeds: ReadonlyArray<number>
  selectBed: (bedId: number) => void
}
export const Beds: FunctionComponent<IProps> = (
  { rooms, selectBed, selectedBeds, reservationBeds }
) => (
  <>
    {rooms.map(room => {
      const bedRoomKind = pipe(
        room.bedroomKind,
        O.map(bedroomKind => `(${bedroomKind.name})`),
        O.getOrElse(() => '')
      )

      const isRoomFull = room.beds.length === pipe(room.beds, A.filter(b => b.booked), A.length)
      return (
        <Stack key={room.id} alignItems={'flex-start'} direction={isRoomFull ? 'row' : 'column'}>
          <Text fontWeight={'bold'} color={isRoomFull ? 'grey' : 'black'}>
            {`Chambre ${room.name} ${bedRoomKind}`}
          </Text>
          {isRoomFull ? <Text color={'grey'}>Complète</Text> : room.beds.map(bed => {
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
        </Stack>
      )
    })}
  </>
)
