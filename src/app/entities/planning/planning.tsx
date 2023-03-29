import { Box, Grid, Text } from '@chakra-ui/react'
import type { IPlace } from 'app/shared/model/place.model'
import { getDateKey } from 'app/shared/util/date-utils'
import type { Dayjs } from 'dayjs'
import React from 'react'

import type { IReservationsPlanning } from '../../shared/model/reservationsPlanning.model'
import { Bed } from './beds'
import { Day } from './day'
import { Months } from './months'
import { Reservation } from './reservation'
import { Room } from './rooms'

interface IProps {
  date: Dayjs
  totalDays: number
  place: IPlace
  reservations: IReservationsPlanning[]
}

// On souhaite afficher 31 jours => Tableau de 31 éléments.
const monthDays = Array.from({ length: 31 })

export const Planning = ({ place, date, totalDays, reservations }: IProps) => {
  // Offset en de départ horizontal des cases chambres
  let roomRowPosition = 4

  // Objects contenant la position en x dans la grille des jours.
  const positionX: number[] = []

  // Objects contenant la position en y dans la grille des lits.
  const positionY: number[] = []

  return (
    <Box>
      <Grid
        className="grid-container"
        borderColor={'#D9D9D9'}
        overflowX={'scroll'}
        overflowY={'hidden'}
      >
        <Text
          gridRowStart={2}
          gridRowEnd={4}
          gridColumnStart={1}
          gridColumnEnd={8}
          textAlign={'center'}
          overflowWrap={'break-word'}
          borderTopStyle={'solid'}
          borderRightStyle={'solid'}
          borderWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          py={2}
          mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
        >
          Chambres
        </Text>
        <Text
          gridRowStart={2}
          gridRowEnd={4}
          gridColumnStart={8}
          gridColumnEnd={16}
          borderTopStyle={'solid'}
          borderWidth={'0.15em'}
          borderBottomStyle={'solid'}
          borderColor={'#D9D9D9'}
          marginBottom={'-0.15em'}
          textAlign={'center'}
          py={2}
          borderX={'0'}
          mt={'-0.1rem'}
        >
          Lits
        </Text>

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
          const gridColumnStart = 16 + index * 2
          // On construit l'object qui va permettre de récupérer la bonne position en X pour afficher les réservations.
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
              <Room room={room} gridRowEnd={roomRowPosition} key={room.id} />,
              room.beds.map((bed, index) => {
                // On construit l'object qui va permettre de récupérer la bonne position en Y pour afficher les réservations.
                positionY[bed.id] = roomRowPosition - index - 1
                return <Bed key={index} bed={bed} rowPosition={roomRowPosition} index={index} />
              })
            ]
          }
        })}
        {
          // Affichage des réservations
        }
        {reservations?.map((reservation, index) => (
          <Reservation
            key={reservation.id}
            reservation={reservation}
            date={date}
            index={index}
            place={place}
            positionX={positionX}
            positionY={positionY}
          />
        ))}
      </Grid>
    </Box>
  )
}
