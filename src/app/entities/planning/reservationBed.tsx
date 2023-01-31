import { HStack } from '@chakra-ui/react'
import React from 'react'

import type { IReservationsPlanning } from '../../shared/model/reservationsPlanning.model'
import ReservationModal from './reservationModal'

interface IProps {
  reservation: IReservationsPlanning
  gridRowStart: number
  gridRowEnd: number
  gridColumnStart: number
  gridColumnEnd: number
  style: React.CSSProperties
}

export const ReservationBed = (
  { reservation, gridRowStart, gridRowEnd, gridColumnStart, gridColumnEnd, style }: IProps
) => // }
(<HStack
  className="reservation"
  gridRowStart={gridRowStart}
  gridRowEnd={gridRowEnd}
  gridColumnEnd={gridColumnEnd}
  gridColumnStart={gridColumnStart}
  style={style}
  maxW={'12rem'}
  mx={4}
  py={2}
>
  <ReservationModal reservation={reservation} />
</HStack>)
