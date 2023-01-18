import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { IReservationsPlanning } from '../../shared/model/reservationsPlanning.model'
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
) => {
  style = Object.assign(
    {
      gridRowStart,
      gridRowEnd,
      gridColumnStart,
      gridColumnEnd
    },
    style
  )
  // }
  return (
    <div className="reservation" style={style}>
      <ReservationModal reservation={reservation} />
      &nbsp;
      <FontAwesomeIcon
        icon={reservation?.isConfirmed ? 'check-circle' : 'times-circle'}
        size="2x"
        color={reservation?.isConfirmed ? 'green' : 'red'}
      />
    </div>
  )
}

export default ReservationBed
