import type { IRoom } from 'app/shared/model/room.model'
import { CustomValidatedField } from 'app/shared/util/cross-validation-form'
import type { FunctionComponent } from 'react'
import React from 'react'

interface IProps {
  rooms: IRoom[]
  bedsToBook: number[]
  checkBedsToBook: (bed: number) => void
}
const Beds: FunctionComponent<IProps> = ({ rooms, bedsToBook, checkBedsToBook }) => (
  <>
    {rooms.map(room => {
      const bedRoomKind = room.bedroomKind ? `(${room.bedroomKind.name})` : ''

      return (
        <React.Fragment key={room.id}>
          <p style={{ fontWeight: 'bold' }}>
            {`Chambre : ${room.name} ${bedRoomKind}
                         `}
          </p>{' '}
          <div>Lits :</div>
          {room.beds.length === 0 ? 'Aucun lits libre à ces dates.' : room.beds.map(bed => {
            const bedkind = bed.kind ? `(${bed.kind})` : ''
            return (
              <CustomValidatedField
                label={`${bed.number} ${bedkind}  (places : ${bed.numberOfPlaces})`}
                key={bed.id}
                type="checkbox"
                id={`reservation-${bed.id}`}
                name={bed.id.toString()}
                data-cy={bed.id.toString()}
                checked={bedsToBook?.includes(bed.id) ? true : false}
                onChange={() => checkBedsToBook(bed.id)}
              />
            )
          })}
          <br />
        </React.Fragment>
      )
    })}
  </>
)

export default Beds
