import type { IPlace } from 'app/shared/model/place.model'
import type { IReservationsPlanning } from 'app/shared/model/reservationsPlanning.model'
import { getDateKey } from 'app/shared/util/date-utils'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { FunctionComponent } from 'react'
import React from 'react'

import { ReservationBed } from './reservationBed'

interface IProps {
  reservation: IReservationsPlanning
  index: number
  place: IPlace
  positionX: number[]
  positionY: number[]
  date: Dayjs
}

export const Reservation: FunctionComponent<IProps> = (
  { reservation, index, place, positionX, positionY, date }
) => {
  const positionYEnd = {}

  const colors = ['#74CAE7', '#E19BE8', '#F08E6A', '#82B865', '#FFCAD4', '#B8D8BA']
  let style = {
    borderWidth: '1px',
    backgroundColor: colors[index] ? colors[index] : `hsl(${Math.random() * 360}, 100%, 75%)`
  } as React.CSSProperties

  // construction de la liste des lits présents au lieu affiché du planning.
  const reservationBedIds: number[] = []
  place.rooms?.forEach(room => {
    room.beds?.forEach(bed => {
      if (reservation.bedsId.includes(bed.id)) {
        reservationBedIds.push(bed.id)
      }
    })
  })

  return (
    <>
      {reservationBedIds.map((bedId: number, indexBed: number) => {
        const endTable = 39
        const arrivalDate = dayjs(reservation.arrivalDate)

        let gridColumnStart: number = positionX[getDateKey(arrivalDate)] === undefined ?
          8 :
          positionX[getDateKey(arrivalDate)]
        const difference = dayjs(reservation?.departureDate).diff(
          dayjs(reservation?.arrivalDate),
          'day'
        )
        const difference2 = dayjs(dayjs(reservation?.departureDate)).diff(
          date.format('YYYY-MM-DD'),
          'day'
        )

        let gridColumnEnd = gridColumnStart + difference >= endTable ?
          endTable :
          gridColumnStart + difference + 1

        if (arrivalDate.isBefore(date, 'day')) {
          gridColumnStart = positionX[getDateKey(date)]

          const difference3 = dayjs(reservation?.departureDate).diff(date, 'day')
          gridColumnEnd = gridColumnStart + difference3 >= endTable ?
            endTable :
            gridColumnStart === 8 ?
            difference2 + 8 + 1 :
            gridColumnStart + difference + 1
          style = Object.assign(
            {
              borderBottomLeftRadius: '0em',
              borderTopLeftRadius: '0em',
              borderLeftStyle: 'none',
              marginLeft: '0.2em'
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
              margin: '0',
              marginLeft: '0.5em'
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
            gridRowStart={positionY[bedId]}
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
