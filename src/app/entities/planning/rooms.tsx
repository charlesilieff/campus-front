import { IRoom } from 'app/shared/model/room.model'
import React, { FunctionComponent } from 'react'

interface IProps {
  room: IRoom
  gridRowEnd: number
}

export const Room: FunctionComponent<IProps> = ({ gridRowEnd, room }) => {
  const style = {
    // On test l'index car la premiére chambre a une postion absolu dans le tableau (de 4).
    gridRowStart: gridRowEnd - room.beds.length,
    gridRowEnd
  } as React.CSSProperties

  return (
    <>
      <div className="rooms" style={style}>
        {room.name}
      </div>
      <div style={{ ...style, gridColumnStart: 8, gridColumnEnd: 40, borderTop: '0.15em solid' }}>
      </div>
    </>
  )
}

export default Room
