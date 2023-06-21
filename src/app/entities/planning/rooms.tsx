import { Box } from '@chakra-ui/react'
import type { RoomDecoded } from 'app/shared/model/room.model'
import type { FunctionComponent } from 'react'
import React from 'react'

interface IProps {
  room: RoomDecoded
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
      <Box className="rooms" style={style} borderColor={'#D9D9D9'} textAlign={'center'} px={1}>
        {room.name}
      </Box>
      <div
        style={{
          ...style,
          gridColumnStart: 16,
          gridColumnEnd: 80,
          borderTop: '0.15em solid #D9D9D9'
        }}
      >
      </div>
    </>
  )
}
