import { MoonIcon, SunIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, Grid, Text } from '@chakra-ui/react'
import type { IMeal } from 'app/shared/model/meal.model'
import { getDateKey } from 'app/shared/util/date-utils'
import type { Dayjs } from 'dayjs'
import React from 'react'

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

  return (
    <Box>
      <Grid
        className="grid-container"
        borderColor={'#D9D9D9'}
        overflowX={'scroll'}
        overflowY={'hidden'}
      >
        <Text
          gridRowStart={4}
          gridRowEnd={5}
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
          p={2}
          backgroundColor={'yellow.50'}
        >
          <TimeIcon />

          Matin
        </Text>
        <Text
          gridRowStart={5}
          gridRowEnd={6}
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
          p={2}
          backgroundColor={'#F7F7F7'}
        >
          <SunIcon />
          Midi
        </Text>
        <Text
          gridRowStart={6}
          gridRowEnd={7}
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
          p={2}
          backgroundColor={'orange.100'}
        >
          <MoonIcon />
          Soir
        </Text>
        <Months date={date} month={0} totalDays={totalDays}></Months>
        {date.date() + numberOfDays - 1 > totalDays && (
          <Months date={date} month={1} totalDays={totalDays}></Months>
        )}

        {monthDays.map((_, index) => {
          const gridColumnStart = 8 + index
          // On construit l'objet qui va permettre de récuperer la bonne position en X pour afficher les réservations.
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
