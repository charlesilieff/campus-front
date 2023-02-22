import { Checkbox, VStack } from '@chakra-ui/react'
import type { IRoom } from 'app/shared/model/room.model'
import type { FunctionComponent } from 'react'
import React from 'react'

interface IProps {
  rooms: IRoom[]
  bedsToBook: number[]
  checkBedsToBook: (bed: number) => void
}
export const Beds: FunctionComponent<IProps> = ({ rooms, bedsToBook, checkBedsToBook }) => (
  <>
    {rooms.map(room => {
      const bedRoomKind = room.bedroomKind ? `(${room.bedroomKind.name})` : ''

      return (
        <VStack alignItems={'flex-start'} key={room.id}>
          <p style={{ fontWeight: 'bold' }}>
            {`Chambre : ${room.name} ${bedRoomKind}
                         `}
          </p>{' '}
          <div>Lits :</div>
          {room.beds.length === 0 ? 'Aucun lits libre à ces dates.' : room.beds.map(bed => {
            const bedkind = bed.kind ? `(${bed.kind})` : ''
            return (
              <Checkbox
                key={bed.id}
                id={`reservation-${bed.id}`}
                name={bed.id.toString()}
                data-cy={bed.id.toString()}
                isChecked={bedsToBook?.includes(bed.id) ? true : false}
                onChange={() => checkBedsToBook(bed.id)}
              >
                {`${bed.number} ${bedkind}  (places : ${bed.numberOfPlaces})`}
              </Checkbox>
            )
          })}
          <br />
        </VStack>
      )
    })}
  </>
)
