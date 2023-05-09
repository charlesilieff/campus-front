import { MoonIcon, SunIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, Grid, Text } from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import { getDateKey } from 'app/shared/util/date-utils'
import type { Dayjs } from 'dayjs'
import React from 'react'
import { FaUtensils } from 'react-icons/fa'

import { Day } from './day'
import { Months } from './months'

interface IProps {
  date: Dayjs
  totalDays: number
  numberOfDays: number
  mealsData: IMeal[]
}

/**
 * Affiche un tableau (colonne : les jours (calendrier)).
 * Chaque jour (Day) comporte les informations suivantes :
 *  - Repas de midi :
 *        - régime spécial
 *        - régime classique
 *  - Repas du soir.
 */
export const MealsUserPlanning = (
  { date, totalDays, numberOfDays, mealsData }: IProps
) => {
  // On souhaite afficher 31 jours => Tableau de 31 élements.
  const monthDays = Array.from({ length: numberOfDays })

  // Objets contenant la position en x dans la grille des jours.
  const positionX = {}
  const positionX7Day = numberOfDays === 7 ? 6 : 8

  return (
    <Box>
      <Grid
        className="grid-container"
        borderColor={'#D9D9D9'}
        overflowX={'scroll'}
        overflowY={'hidden'}
      >
        <Text
          gridRowStart={1}
          gridRowEnd={4}
          gridColumnStart={1}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
          borderRightStyle={'solid'}
          borderRightWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          py={2}
          borderBottom={0}
          borderLeft={0}
          justifyContent={'center'}
          display={'flex'}
          alignItems={'center'}
          p={2}
        >
          Repas &nbsp;<FaUtensils />
        </Text>
        <Text
          gridRowStart={4}
          gridRowEnd={5}
          gridColumnStart={1}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
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
          p={2}
          backgroundColor={'yellow.50'}
        >
          Matin&nbsp;<TimeIcon />
        </Text>
        <Text
          gridRowStart={5}
          gridRowEnd={6}
          gridColumnStart={1}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
          textAlign={'center'}
          overflowWrap={'break-word'}
          borderTopStyle={'solid'}
          borderRightStyle={'solid'}
          borderWidth={'0.15em'}
          borderColor={'#D9D9D9'}
          mt={'-0.1rem'}
          borderBottom={0}
          borderLeft={0}
          alignContent={'center'} // TODO : center??
          verticalAlign={'middle'} // TODO : center??
          backgroundColor={'orange.100'}
          p={2}
        >
          Midi&nbsp;<SunIcon />
        </Text>
        <Text
          gridRowStart={6}
          gridRowEnd={7}
          gridColumnStart={1}
          gridColumnEnd={numberOfDays === 7 ? 6 : 8}
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
          p={2}
          backgroundColor={'#F7F7F7'}
        >
          Soir&nbsp;<MoonIcon />
        </Text>
        <Months date={date} month={0} totalDays={totalDays} numberOfDays={numberOfDays}></Months>
        {date.date() + numberOfDays - 1 > totalDays && (
          <Months date={date} month={1} totalDays={totalDays} numberOfDays={numberOfDays}></Months>
        )}

        {monthDays.map((_, index) => {
          const gridColumnStart = positionX7Day + index
          // On construit l'objet qui va permettre de récupérer la bonne position en X pour afficher les réservations.
          const dateDay = date.add(index, 'day')
          const dateKey = getDateKey(dateDay)
          positionX[dateKey] = gridColumnStart
          return (
            <Day
              positionX={gridColumnStart}
              key={dateKey}
              date={dateDay}
              index={index}
              mealsData={mealsData}
            />
          )
        })}
      </Grid>
    </Box>
  )
}
