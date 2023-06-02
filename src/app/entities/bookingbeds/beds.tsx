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
    {
      // @ts-expect-error TODO: fix this
      rooms.filter(r => r.beds.length !== 0).map(room => {
        const bedRoomKind = room.bedroomKind ? `(${room.bedroomKind.name})` : ''

        return (
          <VStack alignItems={'flex-start'} key={room.id}>
            <p style={{ fontWeight: 'bold' }}>
              {`Chambre : ${room.name} ${bedRoomKind}
                         `}
            </p>{' '}
            <div>Lits :</div>
            {
              // @ts-expect-error TODO: fix this
              room.beds.length === 0 ? 'Aucun lits libre à ces dates.' : room.beds.map(bed => {
                const bedkind = bed.kind ? `(${bed.kind})` : ''
                return (
                  <Checkbox
                    key={bed.id}
                    id={`reservation-${bed.id}`}
                    // @ts-expect-error TODO: fix this
                    name={bed.id.toString()}
                    // @ts-expect-error TODO: fix this
                    data-cy={bed.id.toString()}
                    // @ts-expect-error TODO: fix this
                    isChecked={bedsToBook?.includes(bed.id) ? true : false}
                    // @ts-expect-error TODO: fix this
                    onChange={() => checkBedsToBook(bed.id)}
                  >
                    {`${bed.number} ${bedkind}  (places : ${bed.numberOfPlaces})`}
                  </Checkbox>
                )
              })
            }
            <br />
          </VStack>
        )
      })
    }
  </>
)
