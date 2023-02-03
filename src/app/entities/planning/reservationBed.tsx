import { HStack } from '@chakra-ui/react'
import React from 'react'

import type { IReservationsPlanning } from '../../shared/model/reservationsPlanning.model'
import { ReservationModal } from './reservationModal'

interface IProps {
  reservation: IReservationsPlanning
  gridRowStart: number
  gridRowEnd: number
  gridColumnStart: number
  gridColumnEnd: number
  style: React.CSSProperties
  isRespHebergement: boolean
}

export const ReservationBed = (
  {
    reservation,
    gridRowStart,
    gridRowEnd,
    gridColumnStart,
    gridColumnEnd,
    style,
    isRespHebergement
  }: IProps
) => // }
(<HStack
  className="reservation"
  gridRowStart={gridRowStart}
  gridRowEnd={gridRowEnd}
  gridColumnEnd={gridColumnEnd}
  gridColumnStart={gridColumnStart}
  style={style}
  mx={4}
  my={1}
>
  <ReservationModal reservation={reservation} isRespHebergement={isRespHebergement} />
</HStack>)
