import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'
import { AUTHORITIES } from 'app/config/constants'
import { useAppSelector } from 'app/config/store'
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import type {
  ReservationsPlanning,
  ReservationStatus
} from 'app/shared/model/reservationsPlanning.model'
import { getDateKey } from 'app/shared/util/date-utils'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { FunctionComponent } from 'react'
import React from 'react'

import type { PlaceWithRooms } from './model'
import { ReservationBed } from './reservationBed'

interface IProps {
  reservation: ReservationsPlanning
  index: number
  place: PlaceWithRooms
  positionX: number[]
  positionY: number[]
  date: Dayjs
}

export const Reservation: FunctionComponent<IProps> = (
  { reservation, index, place, positionX, positionY, date }
) => {
  const positionYEnd = {}
  const isRespHebergement = useAppSelector(state =>
    hasAnyAuthority(state.authentication.account, [AUTHORITIES.RESPHEBERGEMENT])
  )
  const colors = ['#74CAE7', '#E19BE8', '#F08E6A', '#82B865', '#FFCAD4', '#B8D8BA']
  const backgroundColorCalculation = (status: ReservationStatus, isRespHebergement: boolean) => {
    if (!isRespHebergement) {
      return colors[index] ? colors[index] : `hsl(${Math.random() * 360}, 100%, 75%)`
    } else {
      switch (status) {
        case 'pending':
          return '#FDEEB5'
        case 'processed':
          return '#D0ECCF'
        case 'urgent':
          return '#FFD7D7'
        default:
          return colors[index] ? colors[index] : `hsl(${Math.random() * 360}, 100%, 75%)`
      }
    }
  }
  const textColorCalculation = (status: ReservationStatus, isRespHebergement: boolean) => {
    if (!isRespHebergement) {
      return 'black'
    } else {
      switch (status) {
        case 'pending':
          return '#906904'
        case 'processed':
          return '#087F23'
        case 'urgent':
          return '#971515'
        default:
          return 'black'
      }
    }
  }

  let style = {
    marginLeft: 0,
    marginRight: 0,
    borderWidth: '1px',
    backgroundColor: backgroundColorCalculation(reservation.status, isRespHebergement),
    color: textColorCalculation(reservation.status, isRespHebergement)
  } as React.CSSProperties

  // construction de la liste des lits présents au lieu affiché du planning.
  const reservationBedIds: number[] = []
  place.rooms.forEach(room => {
    room.beds.forEach(bed => {
      if (
        pipe(bed.id, O.map(id => reservation.bedsId.includes(id)), O.exists(x => x))
        && O.isSome(bed.id)
      ) {
        reservationBedIds.push(bed.id.value)
      }
    })
  })

  return (
    <>
      {reservationBedIds.map((bedId: number, indexBed: number) => {
        const endTable = 39 * 2 + 2

        const arrivalDate = dayjs(reservation.arrivalDate)

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let gridColumnStart: number = positionX[getDateKey(arrivalDate)] === undefined ?
          16 : // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          positionX[getDateKey(arrivalDate)] + 1
        const difference = dayjs(reservation?.departureDate).diff(
          dayjs(reservation?.arrivalDate),
          'day'
        )
        const difference2 = dayjs(dayjs(reservation?.departureDate)).diff(
          date.format('YYYY-MM-DD'),
          'day'
        )

        let gridColumnEnd = gridColumnStart + difference * 2 >= endTable ?
          endTable :
          gridColumnStart + difference * 2

        if (arrivalDate.isBefore(date, 'day')) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          gridColumnStart = positionX[getDateKey(date)]

          const difference3 = dayjs(reservation?.departureDate).diff(date, 'day')
          gridColumnEnd = gridColumnStart + difference3 * 2 >= endTable ?
            endTable :
            gridColumnStart === 16 ?
            difference2 * 2 + 16 + 1 :
            gridColumnStart + difference * 2

          style = Object.assign(
            {
              borderBottomLeftRadius: '0em',
              borderTopLeftRadius: '0em',
              borderLeftStyle: 'none',
              marginLeft: '0.2rem'
            },
            style
          )
        }

        if (
          gridColumnEnd === endTable
          && date.add(30, 'days').format('YYYY-MM-DD')
            !== dayjs(reservation?.departureDate).format('YYYY-MM-DD')
        ) {
          style = Object.assign(
            {
              borderBottomRightRadius: '0em',
              borderTopRightRadius: '0em',
              borderRightStyle: 'none',
              marginRight: '0'
              // marginLeft: '0.5em'
            },
            style
          )
        }

        if (indexBed === 0) {
          positionYEnd[bedId] = positionY[bedId] + 1
        }

        if (indexBed < reservation.bedsId.length - 1) {
          if (positionY[bedId] - 1 === positionY[reservation.bedsId[indexBed + 1]]) {
            positionYEnd[reservation.bedsId[indexBed + 1]] = positionY[bedId] + 2
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            positionYEnd[reservation.bedsId[indexBed + 1]] = positionYEnd[bedId]
            return
          } else {
            positionYEnd[reservation.bedsId[indexBed + 1]] =
              positionY[reservation.bedsId[indexBed + 1]]
              + 1
          }
        }

        return (
          <ReservationBed
            isRespHebergement={isRespHebergement}
            gridRowStart={positionY[bedId]}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            gridRowEnd={positionYEnd[bedId]}
            gridColumnStart={gridColumnStart}
            gridColumnEnd={gridColumnEnd}
            reservation={reservation}
            style={style}
            key={bedId}
          />
        )
      })}
    </>
  )
}
