import { IPlace } from 'app/shared/model/place.model'
import { getDateKey } from 'app/shared/util/date-utils'
import { Dayjs } from 'dayjs'
import React from 'react'

import { IReservationsPlanning } from '../../shared/model/reservationsPlanning.model'
import Bed from './beds'
import Day from './day'
import Months from './months'
import { Reservation } from './reservation'
import Room from './rooms'

interface IProps {
  date: Dayjs
  totalDays: number
  place: IPlace
  reservations: IReservationsPlanning[]
}

// On souhaite afficher 31 jours => Tableau de 31 élements.
const monthDays = Array.from({ length: 31 })

const Planning = ({ place, date, totalDays, reservations }: IProps) => {
  // Offset en de départ horizontal des cases chambres
  let roomRowPosition = 4

  // Objects contenant la position en x dans la grille des jours.
  const positionX = {}

  // Objects contenant la position en y dans la grille des lits.
  const positionY = {}

  return (
    <div className="grid-container">
      <div className="roomNames">Nom des chambres</div>
      <div className="bedNames">Lits</div>

      {
        // Affichage des mois
      }
      <Months date={date} month={0} totalDays={totalDays}></Months>
      {(totalDays < 31 || date.date() !== 1) && (
        <Months date={date} month={1} totalDays={totalDays}></Months>
      )}

      {
        // Affichage des jours
      }
      {monthDays.map((_, index) => {
        const gridColumnStart = 8 + index
        // On construit l'object qui va permettre de récuperer la bonne position en X pour afficher les réservations.
        const dateDay = date.add(index, 'day')
        positionX[getDateKey(dateDay)] = gridColumnStart
        return <Day positionX={gridColumnStart} key={getDateKey(dateDay)} date={dateDay}></Day>
      })}
      {
        // Affichage des chambres
      }
      {place?.rooms?.map(room => {
        if (room.beds.length > 0) {
          // On incrémente en fonction du nombre de lits de la room précédente.
          roomRowPosition += room.beds.length

          return [
            <Room room={room} gridRowEnd={roomRowPosition} key={room.id}></Room>,
            room.beds.map((bed, index) => {
              // On construit l'object qui va permettre de récuperer la bonne postion en Y pour afficher les réservations.
              positionY[bed.id] = roomRowPosition - index - 1
              return <Bed key={index} bed={bed} rowPosition={roomRowPosition} index={index} />
            })
          ]
        }
      })}
      {reservations?.map((reservation, index) =>
        Reservation({ reservation, date, index, place, positionX, positionY })
      )}
    </div>
  )
}

export default Planning
